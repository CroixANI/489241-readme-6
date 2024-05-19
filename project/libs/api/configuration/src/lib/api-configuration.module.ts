import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { messageQueueConfig } from '@project/message-queue';

import apiApplicationConfig from './api-configuration.config'
import { ApiConfigurationEnvFilePath } from './api-configuration.const';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [apiApplicationConfig, messageQueueConfig],
      envFilePath: ApiConfigurationEnvFilePath
    }),
  ]
})
export class ApiConfigurationModule {}
