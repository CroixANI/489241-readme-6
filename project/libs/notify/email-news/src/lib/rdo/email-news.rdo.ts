import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { EmailNewsProperties } from '../email-news.const';

export class EmailNewsRdo {
  @ApiProperty({
    description: EmailNewsProperties.SentDate,
    example: new Date('2024-05-14')
  })
  @Expose()
  public sentDate: Date;
}
