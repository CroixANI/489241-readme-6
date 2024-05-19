import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { getRabbitMQOptions } from '@project/shared-core';

import { MailModule } from './mail.module';
import { EmailSubscriberModel, EmailSubscriberSchema } from './models/email-subscriber.model';
import { EmailSubscriberService } from './email-subscriber.service';
import { EmailSubscriberRepository } from './entities/email-subscriber.repository';
import { EmailSubscriberFactory } from './entities/email-subscriber.factory';
import { EmailSubscriberController } from './email-subscriber.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailSubscriberModel.name, schema: EmailSubscriberSchema }
    ]),
    RabbitMQModule.forRootAsync(
      RabbitMQModule,
      getRabbitMQOptions('message-queue')
    ),
    MailModule,
  ],
  providers: [
    EmailSubscriberService,
    EmailSubscriberRepository,
    EmailSubscriberFactory,
  ],
  exports: [
    EmailSubscriberService,
    EmailSubscriberRepository,
    EmailSubscriberFactory,
  ],
  controllers: [
    EmailSubscriberController
  ]
})
export class EmailSubscriberModule {}
