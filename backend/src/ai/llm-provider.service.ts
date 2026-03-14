import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  LLMProvider,
  LLMMessage,
  LLMOptions,
  LLMResponse,
} from './llm-provider.interface';

@Injectable()
export class LLMProviderService {
  private readonly logger = new Logger(LLMProviderService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.logger.log('Gemini AI Provider initialized successfully.');
    } else {
      this.logger.warn(
        'GEMINI_API_KEY is not set. Falling back to MockProvider.',
      );
    }
  }

  getDefaultProvider(): LLMProvider {
    if (this.genAI && this.model) {
      return this.getGeminiProvider();
    }
    return this.getMockProvider();
  }

  private getGeminiProvider(): LLMProvider {
    return {
      providerName: 'GeminiProvider',
      chat: async (
        messages: LLMMessage[],
        options?: LLMOptions,
      ): Promise<LLMResponse> => {
        try {
          const chatSession = this.model.startChat({
            history: messages.slice(0, -1).map((m: LLMMessage) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            })),
          });

          const lastMessage = messages[messages.length - 1];
          const result = await chatSession.sendMessage(lastMessage.content);
          const response = result.response;

          return {
            content: response.text(),
            usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
          };
        } catch (error) {
          this.logger.error('Gemini chat error', error);
          throw error;
        }
      },
      complete: async (
        prompt: string,
        options?: LLMOptions,
      ): Promise<LLMResponse> => {
        try {
          const result = await this.model.generateContent(prompt);
          const response = result.response;
          return {
            content: response.text(),
            usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
          };
        } catch (error) {
          this.logger.error('Gemini complete error', error);
          throw error;
        }
      },
    };
  }

  private getMockProvider(): LLMProvider {
    return {
      providerName: 'MockProvider',
      chat: async (
        messages: LLMMessage[],
        options?: LLMOptions,
      ): Promise<LLMResponse> => {
        this.logger.log(`Mock Chat called with ${messages.length} messages.`);
        await Promise.resolve(); // Simulate async
        return {
          content:
            'This is a mock AI response. Integrate a real provider like OpenAI or Gemini for production.',
          usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
        };
      },
      complete: async (
        prompt: string,
        options?: LLMOptions,
      ): Promise<LLMResponse> => {
        this.logger.log(`Mock Complete called for prompt.`);
        await Promise.resolve(); // Simulate async
        let content =
          'Based on your interest, here is a mock recommendation:\n\n';
        content +=
          '1. Setup Gemini by adding GEMINI_API_KEY to your .env file.\n';
        content += '2. Explore emerging fields like AI/ML or Biotechnology.\n';
        return {
          content,
          usage: { promptTokens: 50, completionTokens: 100, totalTokens: 150 },
        };
      },
    };
  }
}
