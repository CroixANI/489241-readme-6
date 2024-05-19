import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotifyConfigModule } from '@project/notify-config';
import { getMongooseOptions } from '@project/data-access';
import { EmailSubscriberModule } from '@project/email-subscriber';
import { EmailNewsModule } from '@project/email-news';

@Module({
  imports: [
    NotifyConfigModule,
    MongooseModule.forRootAsync(
      getMongooseOptions()
    ),
    EmailSubscriberModule,
    EmailNewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
