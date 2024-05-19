import { Injectable } from '@nestjs/common';

import { EmailNews, EntityFactory } from '@project/shared-core';
import { EmailNewsEntity } from './email-news.entity';

@Injectable()
export class EmailNewsFactory implements EntityFactory<EmailNewsEntity> {
  public create(entityPlainData: EmailNews): EmailNewsEntity {
    return new EmailNewsEntity(entityPlainData);
  }
}
