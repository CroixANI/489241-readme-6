import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

// Constants
const PORT = 3000;
const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);
  const port = process.env.PORT || PORT;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}/${GLOBAL_PREFIX}`);
}

bootstrap();
