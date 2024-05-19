import { Inject, Body, Controller, Post, UseFilters, UseGuards, UseInterceptors, ParseUUIDPipe, Param, HttpStatus, HttpCode, Patch, Query, Get, Req, Headers } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { apiConfig, BlogEndpoints } from '@project/api-configuration';
import { InjectUserIdInterceptor } from '@project/shared-interceptors';
import { BlogPostWithPaginationRdo, BlogPostQuery } from '@project/blog-post';
import { RequestWithUser } from '@project/authentication';
import { Post as BlogPost } from '@project/shared-core';
import { EmailNewsRdo } from '@project/email-news';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { AddNewPostDto } from './dto/add-new-post.dto';
import { BlogPostOperationDescription, BlogPostPropertiesDescription, BlogPostResponseError, BlogPostResponseMessage } from './blog.constants';
import { NotifyEndpoints } from 'libs/api/configuration/src/lib/api-configuration.const';
import { NotifyService } from '@project/account-notify';

@ApiTags('blog')
@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    @Inject(apiConfig.KEY)
    private readonly config: ConfigType<typeof apiConfig>,
    private readonly httpService: HttpService,
    private readonly notifyService: NotifyService,
  ) {}

  @Post('/')
  @ApiOperation({ summary: BlogPostOperationDescription.CreateBlogPost })
  @ApiCreatedResponse({
    description: BlogPostResponseMessage.CreatedBlogPost,
    type: AddNewPostDto,
  })
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  public async create(@Body() dto: AddNewPostDto, @Req() req: Request) {
    const createBlogUrl = this.config.getBlogUrl(BlogEndpoints.RootPosts);
    const { data } = await this.httpService.axiosRef.post(createBlogUrl, dto, {
      headers: {
        'X-Request-Id': req.headers['X-Request-Id'],
      }
    });
    return data;
  }

  @Get('/')
  @ApiOperation({ summary: BlogPostOperationDescription.ListBlogPosts })
  @ApiOkResponse({
    description: BlogPostResponseMessage.ListBlogPosts,
    type: BlogPostWithPaginationRdo,
  })
  public async index(@Query() query: BlogPostQuery, @Req() req: Request) {
    const queryBlogPostsUrl = this.config.getBlogUrl(BlogEndpoints.RootPosts);
    const { data } = await this.httpService.axiosRef.get(queryBlogPostsUrl,
      {
        params: query,
        headers: {
          'X-Request-Id': req.headers['X-Request-Id'],
        }
      }
    );
    return data;
  }

  @Get('/by-user')
  @ApiOperation({ summary: BlogPostOperationDescription.ListBlogPostsByUser })
  @ApiOkResponse({
    description: BlogPostResponseMessage.ListBlogPosts,
    type: BlogPostWithPaginationRdo,
  })
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  public async getPostsByUser(@Query() query: BlogPostQuery, @Req() { user }: RequestWithUser, @Headers() headers) {
    const queryBlogPostsUrl = this.config.getBlogUrl(BlogEndpoints.RootPosts);
    query.authorId = user.id;
    const { data } = await this.httpService.axiosRef.get(queryBlogPostsUrl,
      {
        params: query,
        headers: {
          'X-Request-Id': headers['X-Request-Id'],
        }
      }
    );
    return data;
  }

  @Patch('/:postId/like')
  @ApiOperation({ summary: BlogPostOperationDescription.AddLikeToBlogPost })
  @ApiParam({ name: "postId", required: true, description: BlogPostPropertiesDescription.Id })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogPostResponseError.BlogNotFound })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: BlogPostResponseError.UnauthorizedRequest })
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  public async like(@Req() { user }: RequestWithUser, @Param('postId', ParseUUIDPipe) postId: string, @Headers() headers) {
    const rootBlogPostUrl = this.config.getBlogUrl(BlogEndpoints.RootPosts);
    await this.httpService.axiosRef.patch(`${rootBlogPostUrl}/${postId}/${BlogEndpoints.LikeBlogPost}/${user.id}`, null, {
      headers: {
        'X-Request-Id': headers['X-Request-Id'],
      }
    });
  }

  @Patch('/:postId/publish')
  @ApiOperation({ summary: BlogPostOperationDescription.PublishBlogPost })
  @ApiParam({ name: "postId", required: true, description: BlogPostPropertiesDescription.Id })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogPostResponseError.BlogNotFound })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: BlogPostResponseError.UnauthorizedRequest })
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  public async publish(@Req() { user }: RequestWithUser, @Param('postId', ParseUUIDPipe) postId: string, @Headers() headers) {
    const rootBlogPostUrl = this.config.getBlogUrl(BlogEndpoints.RootPosts);
    const url = `${rootBlogPostUrl}/${postId}/${BlogEndpoints.PublishBlogPost}/${user.id}`;
    await this.httpService.axiosRef.patch(url, null, {
      headers: {
        'X-Request-Id': headers['X-Request-Id'],
      }
    });
  }

  @Post('/:postId/repost')
  @ApiOperation({ summary: BlogPostOperationDescription.RePostBlogPost })
  @ApiParam({ name: "postId", required: true, description: BlogPostPropertiesDescription.Id })
  @ApiCreatedResponse({
    description: BlogPostResponseMessage.RePostedBlogPost,
    type: AddNewPostDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogPostResponseError.BlogNotFound })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: BlogPostResponseError.UnauthorizedRequest })
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  public async rePost(@Req() { user }: RequestWithUser, @Param('postId', ParseUUIDPipe) postId: string, @Headers() headers) {
    const rootBlogPostUrl = this.config.getBlogUrl(BlogEndpoints.RootPosts);
    const url = `${rootBlogPostUrl}/${postId}/${BlogEndpoints.RePostBlogPost}/${user.id}`;
    const { data } = await this.httpService.axiosRef.post(url, null, {
      headers: {
        'X-Request-Id': headers['X-Request-Id'],
      }
    });
    return data;
  }

  @Patch('/news-notify')
  @ApiOperation({ summary: BlogPostOperationDescription.NewBlogPostsNotification })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async newPostsNotification(@Headers() headers) {
    // get last new blog post notification data
    const lastNotificationUrl = this.config.getNotifyUrl(NotifyEndpoints.GetLastNotificationDate);
    const lastNotificationResponse = await this.httpService.axiosRef.get<EmailNewsRdo>(`${lastNotificationUrl}`, {
      headers: {
        'X-Request-Id': headers['X-Request-Id'],
      }
    });

    // get all blog posts created after last new blog post notification
    const findCreatedAfterDateUrl = this.config.getBlogUrl(BlogEndpoints.FindCreatedAfterDate);
    const laterUrl = `${findCreatedAfterDateUrl}/${lastNotificationResponse.data.sentDate}`;
    const response = await this.httpService.axiosRef.get<BlogPost[]>(laterUrl, {
      headers: {
        'X-Request-Id': headers['X-Request-Id'],
      }
    });

    // send message into MQ about new blog posts to notify about
    await this.notifyService.notifyNewPosts({
      newPosts: response.data
    });
  }
}
