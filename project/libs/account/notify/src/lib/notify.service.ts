import { Inject, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigType } from '@nestjs/config';

import { RabbitRouting } from '@project/shared-core';
import { messageQueueConfig } from '@project/message-queue';

import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { NewPostsDto } from './dto/new-posts.dto';

@Injectable()
export class NotifyService {
  constructor(
    private readonly rabbitClient: AmqpConnection,
    @Inject(messageQueueConfig.KEY)
    private readonly rabbiOptions: ConfigType<typeof messageQueueConfig>,
  ) {}

  public async registerSubscriber(dto: CreateSubscriberDto) {
    return this.rabbitClient.publish<CreateSubscriberDto>(
      this.rabbiOptions.exchange,
      RabbitRouting.AddSubscriber,
      { ...dto }
    );
  }

  public async notifyNewPosts(dto: NewPostsDto) {
    return this.rabbitClient.publish<NewPostsDto>(
      this.rabbiOptions.exchange,
      RabbitRouting.NewPosts,
      { ...dto }
    );
  }
}
