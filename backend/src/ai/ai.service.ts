import { Injectable, Logger } from '@nestjs/common';
import { LLMProviderService } from './llm-provider.service';
import { PrismaService } from '../prisma/prisma.service';
import { StatsService } from '../stats/stats.service';
import { ScholarshipsService } from '../scholarships/scholarships.service';
import { AuditService, AuditEventType } from '../audit/audit.service';
import { UpdateAiSettingsDto } from './dto/update-ai-settings.dto';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly llmProviderService: LLMProviderService,
    private readonly prisma: PrismaService,
    private readonly statsService: StatsService,
    private readonly scholarshipsService: ScholarshipsService,
    private readonly auditService: AuditService,
  ) {}

  async processAdminCommand(command: string, userId: string) {
    const lowerCommand = command.toLowerCase();
    this.logger.log(`Processing command for user ${userId}: ${command}`);

    try {
      if (
        lowerCommand.includes('stats') ||
        lowerCommand.includes('statistics')
      ) {
        const stats = await this.statsService.getSystemStats();
        return {
          message: 'Here are the current system statistics:',
          data: stats,
        };
      }

      if (lowerCommand.includes('ban user')) {
        const idMatch = command.match(/id\s+["']([^"']+)["']/i);
        if (idMatch) {
          const targetUserId = idMatch[1];
          // Implementing ban logic directly to avoid circular dependency
          await this.prisma.profile.update({
            where: { id: targetUserId },
            data: { isBanned: true },
          });

          await this.auditService.logEvent({
            eventType: AuditEventType.ADMIN_USER_UPDATE,
            userId: userId,
            details: { targetUserId, action: 'ban', via: 'AI Command' },
            severity: 'high',
          });

          return {
            message: `User ${targetUserId} has been banned.`,
            data: { userId: targetUserId, status: 'banned' },
          };
        }
        return {
          message:
            'Please specify the user ID in quotes, e.g., ban user id "123".',
          data: null,
        };
      }

      if (lowerCommand.includes('inactive users')) {
        const daysMatch = command.match(/(\d+)\s+days?/);
        const days = daysMatch ? parseInt(daysMatch[1], 10) : 30;
        const users = await this.statsService.getInactiveUsers(days);
        return {
          message: `Found ${users.length} inactive users in the last ${days} days.`,
          data: users,
        };
      }

      if (lowerCommand.includes('create scholarship')) {
        const titleMatch = command.match(/title\s+["']([^"']+)["']/i);
        const amountMatch = command.match(/amount\s+["']([^"']+)["']/i);

        if (titleMatch) {
          const title = titleMatch[1];
          const amount = amountMatch ? amountMatch[1] : null;

          const scholarship = await this.scholarshipsService.create({
            title,
            amount: amount ? parseFloat(amount) : null,
            provider: 'AI Generated',
            description: 'Created via AI Command Center',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days deadline
            eligibilityCriteria: {},
          });

          return {
            message: `Scholarship "${title}" created successfully.`,
            data: scholarship,
          };
        } else {
          return {
            message:
              'Please provide a title for the scholarship in quotes (e.g., title "My Scholarship").',
            data: null,
          };
        }
      }

      // Fallback for unrecognized commands
      return {
        message:
          "I didn't understand that command. Try:\n- 'Show system stats'\n- 'Show inactive users (30 days)'\n- 'Ban user id \"USER_ID\"'\n- 'Create scholarship title \"Name\" amount \"$1000\"'",
        data: null,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Error processing command: ${errorMessage}`);
      return {
        message: `Error executing command: ${errorMessage}`,
        data: null,
      };
    }
  }

  async chat(userId: string, message: string, conversationId?: string) {
    let currentConversationId = conversationId;

    if (!currentConversationId) {
      const conversation = await this.prisma.aiConversation.create({
        data: {
          userId,
          title: message.substring(0, 50),
        },
      });
      currentConversationId = conversation.id;
    }

    // Save user message
    await this.prisma.aiMessage.create({
      data: {
        conversationId: currentConversationId,
        role: 'user',
        content: message,
      },
    });

    const provider = this.llmProviderService.getDefaultProvider();

    // Fetch previous messages for context
    const history = await this.prisma.aiMessage.findMany({
      where: { conversationId: currentConversationId },
      orderBy: { createdAt: 'asc' },
      select: { role: true, content: true },
    });

    const messages: ChatMessage[] = history.map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    const response = await provider.chat(messages);

    // Save AI response
    await this.prisma.aiMessage.create({
      data: {
        conversationId: currentConversationId,
        role: 'assistant',
        content: response.content,
      },
    });

    return {
      response: response.content,
      conversationId: currentConversationId,
    };
  }

  async getChatHistory(userId: string) {
    return this.prisma.aiConversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateResponse(prompt: string) {
    const provider = this.llmProviderService.getDefaultProvider();

    // Try to find relevant data to enhance the response
    const [scholarships, jobs] = await Promise.all([
      this.prisma.scholarship.findMany({
        where: {
          OR: [
            { title: { contains: prompt } },
            { description: { contains: prompt } },
          ],
        },
        take: 3,
      }),
      this.prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: prompt } },
            { description: { contains: prompt } },
          ],
        },
        take: 3,
      }),
    ]);

    let context = '';
    if (scholarships.length > 0) {
      context += `\nRelevant Scholarships: ${scholarships.map((s) => s.title).join(', ')}`;
    }
    if (jobs.length > 0) {
      context += `\nRelevant Jobs: ${jobs.map((j) => j.title).join(', ')}`;
    }

    const enhancedPrompt = `You are an expert Indian education and career counselor.
    User Question: ${prompt}
    ${context ? `Available Opportunities in our database: ${context}` : ''}
    
    Provide a detailed, helpful, and encouraging response. If you found relevant opportunities above, mention them.`;

    const response = await provider.complete(enhancedPrompt);
    return { response: response.content };
  }

  getRecommendations(userId: string, type = 'courses') {
    this.logger.log(`Generating recommendations for ${userId}`);

    // In a real scenario, this would use LLM or Collaborative Filtering based on user history
    // const _profile = await this.prisma.profile.findUnique({
    //   where: { id: userId },
    //   select: { role: true },
    // });

    if (type === 'courses') {
      return [
        {
          id: '1',
          title: 'Advanced React Patterns',
          provider: 'USG India',
          match: 95,
        },
        {
          id: '2',
          title: 'NestJS Masterclass',
          provider: 'USG India',
          match: 88,
        },
        {
          id: '3',
          title: 'System Design for Enterprise',
          provider: 'USG India',
          match: 82,
        },
      ];
    } else if (type === 'jobs') {
      return [
        {
          id: '101',
          title: 'Senior Backend Engineer',
          provider: 'TechFlow',
          match: 90,
        },
        {
          id: '102',
          title: 'Fullstack Architect',
          provider: 'InnovateCorp',
          match: 85,
        },
      ];
    }
    return [];
  }

  async getSettings(): Promise<Record<string, any>> {
    const settings = await this.prisma.systemSetting.findMany({
      where: {
        key: {
          in: ['ai_model_toggles', 'ai_rate_limits'],
        },
      },
    });

    const result: Record<string, any> = {};
    settings.forEach((s) => {
      result[s.key] = s.value;
    });

    return result;
  }

  async updateSettings(key: string, value: UpdateAiSettingsDto) {
    const stringValue = JSON.stringify(value);
    return this.prisma.systemSetting.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue },
    });
  }

  async getAiUsage() {
    const [totalConversations, totalMessages] = await Promise.all([
      this.prisma.aiConversation.count(),
      this.prisma.aiMessage.count(),
    ]);

    return {
      totalConversations,
      totalMessages,
      tokenUsage: totalMessages * 450, // Estimated tokens
      activeProviders: ['OpenAI', 'Anthropic'],
      costThisMonth: totalMessages * 0.01, // Mock cost calculation
      dailyUsage: await this.getDailyAiUsage(),
    };
  }

  private async getDailyAiUsage() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await this.prisma.aiMessage.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    });

    const daily: Record<string, number> = {};
    logs.forEach((log) => {
      const date = log.createdAt.toISOString().split('T')[0];
      daily[date] = (daily[date] || 0) + log._count.id;
    });

    return Object.entries(daily).map(([date, tokens]) => ({
      date,
      tokens: tokens * 450,
    }));
  }
}
