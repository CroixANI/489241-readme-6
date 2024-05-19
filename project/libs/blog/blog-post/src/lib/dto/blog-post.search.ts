import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { BlogPostPropertiesDescription, BlogPostQueryDefaults } from '../blog-post.constants';

export class BlogPostSearchCriteria {
  @Transform(({ value }) => +value || BlogPostQueryDefaults.DefaultSearchByTitleLimit)
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: BlogPostPropertiesDescription.QueryLimit,
    example: 10,
    required: true,
  })
  public limit = BlogPostQueryDefaults.DefaultSearchByTitleLimit;

  @IsString()
  @ApiProperty({
    description: BlogPostPropertiesDescription.SearchByTitle,
    required: false,
  })
  public text: string;
}
