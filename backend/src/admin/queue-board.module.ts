import { Module, DynamicModule } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule } from '@nestjs/bullmq';

@Module({})
export class QueueBoardModule {
  static register(): DynamicModule {
    if (process.env.REDIS_SUPPORTED !== 'true') {
      return {
        module: QueueBoardModule,
      };
    }

    return {
      module: QueueBoardModule,
      imports: [
        BullBoardModule.forRoot({
          route: '/queues',
          adapter: ExpressAdapter,
        }),
        BullBoardModule.forFeature({
          name: 'email',
          adapter: BullMQAdapter,
        }),
        BullBoardModule.forFeature({
          name: 'certificate',
          adapter: BullMQAdapter,
        }),
        // Import BullModule to ensure queues are available, though they should be from WorkersModule
        BullModule.registerQueue({ name: 'email' }, { name: 'certificate' }),
      ],
    };
  }
}
