import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Post, Subscriber } from '@project/shared-core';
import { EmailConfig } from '@project/email-config';

import { EmailSubjects } from './mail.const';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @Inject(EmailConfig.KEY)
  private readonly emailConfig: ConfigType<typeof EmailConfig>

  public async sendNotifyNewSubscriber(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      from: this.emailConfig.from,
      to: subscriber.email,
      subject: EmailSubjects.SubscriptionAdded,
      template: './add-subscriber',
      context: {
        user: `${subscriber.firstName} ${subscriber.lastName}`,
        email: `${subscriber.email}`,
      }
    })
  }

  public async sendNotificationAboutNewPosts(subscribers: Subscriber[], newPosts: Post[]) {
    await this.mailerService.sendMail({
      from: this.emailConfig.from,
      to: subscribers.map(subscriber => subscriber.email),
      subject: EmailSubjects.NewPosts,
      template: './new-posts',
      context: { newPosts }
    });
  }
}
