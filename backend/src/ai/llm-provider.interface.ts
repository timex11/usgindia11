export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  providerName: string;
  chat(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse>;
  complete(prompt: string, options?: LLMOptions): Promise<LLMResponse>;
}
