import dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseMongoRepository } from '@project/data-access';

import { EmailNewsEntity } from './email-news.entity';
import { EmailNewsFactory } from './email-news.factory';
import { EmailNewsModel } from '../models/email-news.model';

@Injectable()
export class EmailNewsRepository extends BaseMongoRepository<EmailNewsEntity, EmailNewsModel> {
  constructor(
    entityFactory: EmailNewsFactory,
    @InjectModel(EmailNewsModel.name) emailSubscriberModel: Model<EmailNewsModel>
    ) {
    super(entityFactory, emailSubscriberModel);
  }

  public async findLatest(): Promise<EmailNewsEntity | null> {
    const document = await this.model.findOne().sort({ sentDate: -1 }).exec();
    if (!document) {
      return null;
    }

    return this.createEntityFromDocument(document);
  }
}
