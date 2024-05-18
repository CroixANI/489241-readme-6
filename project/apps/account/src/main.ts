import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app/app.module';
import { AccountConfigurationRegistrationKey, AccountConfigurationPorts } from '@project/account-configuration';

// Constants
const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('Account Application')
    .setDescription('Helps to manage users and handle authentication')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(GLOBAL_PREFIX + '/swagger', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  const configService = app.get(ConfigService);
  const port = configService.get(AccountConfigurationRegistrationKey + '.port')
    || AccountConfigurationPorts.DEFAULT_ACCOUNT_PORT;

  Logger.verbose("envs", configService["internalConfig"]);

  await app.listen(port );
  Logger.log(`🚀 Account is running on: http://localhost:${port}/${GLOBAL_PREFIX}`);
}

bootstrap();
