import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { PaginationResult, PostState } from '@project/shared-core';
import { BlogCategoryService } from '@project/blog-category';

import { BlogPostRepository } from './blog-post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostQuery } from './dto/blog-post.query';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostResponseError } from './blog-post.constants';
import { BlogCommentEntity, BlogCommentFactory, BlogCommentRepository, CreateCommentDto } from '@project/blog-comment';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly blogCategoryService: BlogCategoryService,
    private readonly blogCommentRepository: BlogCommentRepository,
    private readonly blogCommentFactory: BlogCommentFactory,
  ) {}

  public async getAllPosts(query?: BlogPostQuery): Promise<PaginationResult<BlogPostEntity>> {
    return this.blogPostRepository.find(query);
  }

  public async createPost(dto: CreatePostDto): Promise<BlogPostEntity> {
    const categories = await this.blogCategoryService.getCategoriesByIds(dto.categories);
    const newPost = BlogPostFactory.createFromCreatePostDto(dto, categories);
    await this.blogPostRepository.save(newPost);

    return newPost;
  }

  public async deletePost(id: string): Promise<void> {
    try {
      await this.blogPostRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  public async getPost(id: string): Promise<BlogPostEntity> {
    return this.blogPostRepository.findById(id);
  }

  public async updatePost(id: string, dto: UpdatePostDto): Promise<BlogPostEntity> {
    const existsPost = await this.blogPostRepository.findById(id);
    let isSameCategories = true;
    let hasChanges = false;

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined && key !== 'categories' && existsPost[key] !== value) {
        existsPost[key] = value;
        hasChanges = true;
      }

      if (key === 'categories' && value) {
        const currentCategoryIds = existsPost.categories.map((category) => category.id);
        isSameCategories = currentCategoryIds.length === value.length &&
          currentCategoryIds.some((categoryId) => value.includes(categoryId));

        if (! isSameCategories) {
          existsPost.categories = await this.blogCategoryService.getCategoriesByIds(dto.categories);
        }
      }
    }

    if (isSameCategories && ! hasChanges) {
      return existsPost;
    }

    await this.blogPostRepository.update(existsPost);

    return existsPost;
  }

  public async addComment(postId: string, dto: CreateCommentDto): Promise<BlogCommentEntity> {
    const existsPost = await this.getPost(postId);
    if (!existsPost) {
      throw new NotFoundException(BlogPostResponseError.BlogNotFound);
    }

    const newComment = this.blogCommentFactory.createFromDto(dto, existsPost.id);
    await this.blogCommentRepository.save(newComment);

    return newComment;
  }

  public async like(postId: string, userId: string) {
    const existsPost = await this.getPost(postId);
    if (!existsPost) {
      throw new NotFoundException(BlogPostResponseError.BlogNotFound);
    }

    if (existsPost.state !== PostState.Published) {
      throw new BadRequestException(BlogPostResponseError.LikeAllowedForPublishedBlogPost);
    }

    existsPost.toggleLike(userId);
    await this.blogPostRepository.saveChangedLikes(existsPost);

    return existsPost;
  }

  public async publish(postId: string, userId: string) {
    const existsPost = await this.getPost(postId);
    if (!existsPost) {
      throw new NotFoundException(BlogPostResponseError.BlogNotFound);
    }

    if (existsPost.state === PostState.Published)
      return;

    if (existsPost.userId !== userId) {
      throw new UnauthorizedException(BlogPostResponseError.UnauthorizedRequest);
    }

    existsPost.togglePublish();
    await this.blogPostRepository.saveChangedState(existsPost);

    return existsPost;
  }

  public async rePost(postId: string, userId: string): Promise<BlogPostEntity> {
    const existsPost = await this.getPost(postId);
    if (!existsPost) {
      throw new NotFoundException(BlogPostResponseError.BlogNotFound);
    }

    if (existsPost.userId === userId) {
      throw new BadRequestException(BlogPostResponseError.AuthorCanNotRePostOwnPost);
    }

    if (existsPost.state === PostState.Draft) {
      throw new BadRequestException(BlogPostResponseError.RePostAllowedForPublishedBlogPost);
    }

    const existsRePost = await this.blogPostRepository.findByOriginalPostId(postId);
    if (existsRePost) {
      throw new BadRequestException(BlogPostResponseError.AlreadyRePosted);
    }

    return await this.blogPostRepository.rePost(existsPost, userId);
  }

  public async findCreatedAfterDate(date: Date) {
    return await this.blogPostRepository.findCreatedAfterDate(date);
  }
}
