import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty } from 'class-validator';

import { Post } from '@project/shared-core';
import { EmailNewsErrors, EmailNewsProperties } from '../email-news.const';

export class NewPostsDto {
  @ApiProperty({
    description: EmailNewsProperties.NewPosts,
    required: true,
    isArray: true,
  })
  @ArrayNotEmpty({ message: EmailNewsErrors.NewPostsIsRequired })
  public newPosts: Post[];
}
