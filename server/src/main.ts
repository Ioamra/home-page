import compression from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import multiPart from '@fastify/multipart';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';
import { ExceptionInterceptor } from './common/interceptors/execption.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);
  const allowedOrigins = ['http://localhost:4200'];

  // Sécurité cookies
  await app.register(fastifyCookie, {
    secret: configService.get<string>('cookie.secret'),
  });

  // Middlewares Fastify
  await app.register(multiPart);
  await app.register(helmet);
  await app.register(fastifyCsrfProtection);
  await app.register(compression, { encodings: ['gzip'], global: true });
  // Intercepteur global en mode dev
  if (configService.get('devMode')) {
    app.useGlobalInterceptors(new ExceptionInterceptor());
  }
  // WebSocket
  app.useWebSocketAdapter(new WsAdapter(app));

  // CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        Logger.warn(`CORS refusé pour l'origine : ${origin}`);
        return callback(new Error('Not allowed by CORS'), undefined);
      }
    },
    credentials: true,
  });

  // Port
  const port = Number(configService.get('port')) || 3000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`Server running on http://localhost:${port} !`, 'Bootstrap');
}

void bootstrap();
