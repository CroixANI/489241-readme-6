import { Module } from '@nestjs/common';

import { BlogCategoryModule } from '@project/blog-category';
import { PrismaClientModule } from '@project/blog-models';

import { BlogPostController } from './blog-post.controller';
import { BlogPostService } from './blog-post.service';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostFactory } from './blog-post.factory';
import { BlogCommentModule } from '@project/blog-comment';

@Module({
  imports: [BlogCategoryModule, BlogCommentModule, PrismaClientModule],
  controllers: [BlogPostController],
  providers: [BlogPostService, BlogPostRepository, BlogPostFactory],
  exports: [BlogPostService],
})
export class BlogPostModule {}
