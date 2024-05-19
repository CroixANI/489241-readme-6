import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { getRabbitMQOptions } from '@project/shared-core';
import { EmailSubscriberModule } from '@project/email-subscriber';

import { EmailNewsModel, EmailNewsSchema } from './models/email-news.model';
import { EmailNewsController } from './email-news.controller';
import { EmailNewsService } from './email-news.service';
import { EmailNewsRepository } from './entities/email-news.repository';
import { EmailNewsFactory } from './entities/email-news.factory';
import { MailModule } from '@project/email-subscriber';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailNewsModel.name, schema: EmailNewsSchema }
    ]),
    RabbitMQModule.forRootAsync(
      RabbitMQModule,
      getRabbitMQOptions('notify.rabbit')
    ),
    EmailSubscriberModule,
    MailModule
  ],
  controllers: [EmailNewsController],
  providers: [
    EmailNewsService,
    EmailNewsRepository,
    EmailNewsFactory,
  ]
})
export class EmailNewsModule { }
