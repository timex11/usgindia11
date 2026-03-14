import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import helmet from 'helmet';
import compression from 'compression';
import * as dotenv from 'dotenv';
import { ZodValidationPipe } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

dotenv.config();

async function bootstrap() {
  // Skip blocking Redis check in dev/bootstrap. Assume false or set via env.
  // Ideally this should be a health check or async init.
  if (process.env.NODE_ENV === 'production') {
    // Keep blocking check for prod safety if required, or move to health check
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use Pino Logger
  app.useLogger(app.get(PinoLogger));

  const configService = app.get(ConfigService);

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Enable transformation of response objects (e.g., excluding @Exclude properties)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdnjs.cloudflare.com',
            'https://cdn.jsdelivr.net',
          ], // Add analytics/monitoring domains here
          imgSrc: [
            "'self'",
            'data:',
            'https:',
            'blob:',
            'https://*.supabase.co',
          ],
          connectSrc: [
            "'self'",
            configService.get<string>('FRONTEND_URL') ||
              'http://localhost:3000',
            'https://*.supabase.co',
            'wss://*.supabase.co',
          ],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // For image serving
    }),
  );

  app.use(compression());

  // Strict CORS
  const allowedOrigins = configService
    .get<string>('ALLOWED_ORIGINS')
    ?.split(',') || ['http://localhost:3000', 'https://usgindia.com'];

  // Also allow FRONTEND_URL if not in allowedOrigins to prevent dev issues
  const frontendUrl = configService.get<string>('FRONTEND_URL');
  if (frontendUrl && !allowedOrigins.includes(frontendUrl)) {
    allowedOrigins.push(frontendUrl);
  }

  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${requestOrigin}`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ZodValidationPipe());
  // HttpExceptionFilter is registered globally in AppModule

  if (process.env.ENABLE_SWAGGER !== 'false') {
    const config = new DocumentBuilder()
      .setTitle('USG India API')
      .setDescription('The official USG India educational platform API')
      .setVersion('2.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);

  if (process.env.ENABLE_SWAGGER !== 'false') {
    Logger.log(
      `📝 Swagger documentation available at: http://localhost:${port}/api/docs`,
    );
  }
}
void bootstrap();
