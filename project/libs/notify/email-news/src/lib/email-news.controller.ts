import { Controller, Get } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RabbitRouting } from '@project/shared-core';

import { EmailNewsService } from './email-news.service';
import { NewPostsDto } from './dto/new-posts.dto';
import { NewPostsOperationDescription, NewPostsResponseMessage } from './email-news.const';
import { EmailNewsRdo } from './rdo/email-news.rdo';
import { fillDto } from '@project/shared-helpers';

@ApiTags('notify')
@Controller()
export class EmailNewsController {
  constructor(
    private readonly emailNewsService: EmailNewsService,
  ) {}

  @RabbitSubscribe({
    exchange: 'readme.notify.income',
    routingKey: RabbitRouting.NewPosts,
    queue: 'readme.notify.income',
  })
  public async sendNotificationAboutNewPosts(newPosts: NewPostsDto) {
    this.emailNewsService.sendNotificationAboutNewPosts(newPosts.newPosts);
  }

  @Get('/last')
  @ApiOperation({ summary: NewPostsOperationDescription.LastNotification })
  @ApiOkResponse({
    description: NewPostsResponseMessage.LastNotification,
    type: EmailNewsRdo,
  })
  public async getLastNotificationDate() : Promise<EmailNewsRdo | null>{
    const entity = await this.emailNewsService.findLatest();
    if (! entity) {
      return null;
    }
    return fillDto(EmailNewsRdo, { ...entity.toPOJO() });
  }
}
