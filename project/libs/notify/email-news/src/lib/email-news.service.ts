import dayjs from 'dayjs';
import { Injectable, Logger } from '@nestjs/common';

import { Post } from '@project/shared-core';
import { EmailSubscriberRepository, MailService } from '@project/email-subscriber';

import { EmailNewsEntity } from './entities/email-news.entity';
import { EmailNewsRepository } from './entities/email-news.repository';
import { MIN_DATE } from './email-news.const';

@Injectable()
export class EmailNewsService {
  private readonly logger = new Logger(EmailNewsService.name);

  constructor(
    private readonly emailNewsRepository: EmailNewsRepository,
    private readonly emailSubscriberRepository: EmailSubscriberRepository,
    private readonly mailService: MailService,
  ) { }

  public async findLatest() : Promise<EmailNewsEntity | null> {
    const data = await this.emailNewsRepository.findLatest();
    if (! data) {
      return new EmailNewsEntity({ sentDate: dayjs(MIN_DATE).toDate()})
    }
    return data;
  }

  public async sendNotificationAboutNewPosts(newPosts: Post[]) {
    if (! newPosts || newPosts.length == 0) {
      this.logger.verbose('No new posts. No need to send notification.');
      return;
    }

    const subscribers = await this.emailSubscriberRepository.findAll();
    if (! subscribers || subscribers.length == 0) {
      this.logger.verbose('No subscribers. No need to send notification.');
      return;
    }

    await this.mailService.sendNotificationAboutNewPosts(subscribers, newPosts);
    await this.emailNewsRepository.save(new EmailNewsEntity({ sentDate: dayjs().toDate() }));
  }
}
