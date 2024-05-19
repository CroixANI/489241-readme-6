import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { NotifyModule } from '@project/account-notify';
import { ApiConfigurationModule, getHttpClientOptions } from '@project/api-configuration';

import { UsersController } from './users.controller';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { BlogController } from './blog.controller';

@Module({
  imports: [
    ApiConfigurationModule,
    HttpModule.registerAsync({
      imports: [ApiConfigurationModule],
      useFactory: getHttpClientOptions,
      inject: [ConfigService],
    }),
    NotifyModule
  ],
  controllers: [
    UsersController,
    BlogController,
  ],
  providers: [
    CheckAuthGuard,
  ]
})
export class ApiGatewayModule {}
