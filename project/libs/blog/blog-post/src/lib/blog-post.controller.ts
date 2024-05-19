import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { fillDto } from '@project/shared-helpers';
import { CommentRdo, CreateCommentDto } from '@project/blog-comment';

import { BlogPostService } from './blog-post.service';
import { BlogPostRdo } from './rdo/blog-post.rdo';
import { BlogPostQuery } from './dto/blog-post.query';
import { BlogPostWithPaginationRdo } from './rdo/blog-post-with-pagination.rdo';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostOperationDescription, BlogPostPropertiesDescription, BlogPostResponseError, BlogPostResponseMessage } from './blog-post.constants';
import { MongoIdValidationPipe } from '@project/pipes';

@ApiTags('blog')
@Controller('posts')
export class BlogPostController {
  constructor (
    private readonly blogPostService: BlogPostService,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: BlogPostOperationDescription.ShowBlogPostById })
  @ApiOkResponse({
    description: BlogPostResponseMessage.ShowBlogPostById,
    type: BlogPostRdo,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogPostResponseError.BlogNotFound })
  public async show(@Param('id', ParseUUIDPipe) id: string) {
    const post = await this.blogPostService.getPost(id);
    return fillDto(BlogPostRdo, post.toPOJO());
  }

  @Get('/')
  @ApiOperation({ summary: BlogPostOperationDescription.ListBlogPosts })
  @ApiOkResponse({
    description: BlogPostResponseMessage.ListsBlogPosts,
    type: BlogPostWithPaginationRdo,
  })
  public async index(@Query() query: BlogPostQuery) {
    const postsWithPagination = await this.blogPostService.getAllPosts(query);
    const result = {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map((post) => post.toPOJO()),
    }
    return fillDto(BlogPostWithPaginationRdo, result);
  }

  @Post('/')
  @ApiOperation({ summary: BlogPostOperationDescription.CreateBlogPost })
  @ApiCreatedResponse({
    description: BlogPostResponseMessage.CreatedBlogPost,
    type: CreatePostDto,
  })
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(BlogPostRdo, newPost.toPOJO());
  }

  @Delete('/:id')
  @ApiOperation({ summary: BlogPostOperationDescription.DeleteBlogPostById })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogPostResponseError.BlogNotFound })
  public async destroy(@Param('id', ParseUUIDPipe) id: string) {
    await this.blogPostService.deletePost(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: BlogPostOperationDescription.UpdateBlogPostById })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogPostResponseError.BlogNotFound })
  public async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.blogPostService.updatePost(id, dto);
    return fillDto(BlogPostRdo, updatedPost.toPOJO());
  }

  @Post('/:postId/comments')
  @ApiOperation({ summary: BlogPostOperationDescription.CreateCommentForBlogId })
  @ApiCreatedResponse({
    description: BlogPostResponseMessage.CreateCommentForBlogId,
    type: CommentRdo,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogPostResponseError.BlogNotFound })
  public async createComment(@Param('postId', ParseUUIDPipe) postId: string, @Body() dto: CreateCommentDto) {
    const newComment = await this.blogPostService.addComment(postId, dto);
    return fillDto(CommentRdo, newComment.toPOJO());
  }

  @Patch('/:postId/like/:userId')
  @ApiOperation({ summary: BlogPostOperationDescription.AddLikeToBlogPost })
  @ApiParam({ name: "postId", required: true, description: BlogPostPropertiesDescription.Id })
  @ApiParam({ name: "userId", required: true, description: BlogPostPropertiesDescription.UserId })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogPostResponseError.BlogNotFound })
  public async like(@Param('postId', ParseUUIDPipe) postId: string, @Param('userId', MongoIdValidationPipe) userId: string) {
    await this.blogPostService.like(postId, userId);
  }

  @Patch('/:postId/publish/:userId')
  @ApiOperation({ summary: BlogPostOperationDescription.PublishBlogPost })
  @ApiParam({ name: "postId", required: true, description: BlogPostPropertiesDescription.Id })
  @ApiParam({ name: "userId", required: true, description: BlogPostPropertiesDescription.UserId })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogPostResponseError.BlogNotFound })
  public async publish(@Param('postId', ParseUUIDPipe) postId: string, @Param('userId', MongoIdValidationPipe) userId: string) {
    await this.blogPostService.publish(postId, userId);
  }

  @Post('/:postId/repost/:userId')
  @ApiOperation({ summary: BlogPostOperationDescription.RePostBlogPost })
  @ApiParam({ name: "postId", required: true, description: BlogPostPropertiesDescription.Id })
  @ApiParam({ name: "userId", required: true, description: BlogPostPropertiesDescription.UserId })
  @ApiCreatedResponse({
    description: BlogPostResponseMessage.RePostedBlogPost,
    type: CreatePostDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogPostResponseError.BlogNotFound })
  public async rePost(@Param('postId', ParseUUIDPipe) postId: string, @Param('userId', MongoIdValidationPipe) userId: string) {
    return await this.blogPostService.rePost(postId, userId);
  }

  @Get('/later/:date')
  @ApiOperation({ summary: BlogPostOperationDescription.FindCreatedAfterDate })
  @ApiParam({ name: "date", required: true, type: "date", description: BlogPostPropertiesDescription.CreateAt })
  @ApiOkResponse({
    type: BlogPostRdo,
    description: BlogPostResponseMessage.FindCreatedAfterDate,
    isArray: true,
  })
  public async findCreatedAfterDate(@Query('date') date: Date) {
    const posts = await this.blogPostService.findCreatedAfterDate(date);
    return posts.map(post => fillDto(BlogPostRdo, post.toPOJO()));
  }
}
