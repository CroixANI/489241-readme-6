export enum BlogPostPropertiesDescription {
  Id = 'The blog post unique identifier (GUID)',
  Title = 'The blog post title',
  Description = 'The blog post short description',
  Content = 'The blog post content',
  UserId = 'The blog post author id',
  Categories = 'The blog post categories list',
  Comments = 'The blog post recent comments',
  CreateAt = 'The blog post creation date',
  PostType = 'The blog post type (text, video, link and etc.)',
  QueryLimit = 'Page size',
  QueryCategories = 'Array of blog categories to filter by',
  QuerySortDirection = 'Sort direction',
  QuerySortProperty = 'Sort property',
  QueryPageNumber = "Page number",
  QueryPostType = 'Blog post type',
  QueryPostAuthor = 'Blog post Author Id',
  QueryPostState = 'Blog post state',
  SearchByTitle = 'Search by title'
}

export enum BlogPostsWithPagingPropertiesDescription {
  Entities = 'Array of blog posts',
  TotalPages = 'Number of total pages',
  TotalItems = 'Number of total items',
  CurrentPage = 'Current page index',
  ItemsPerPage = 'Page size'
}

export enum BlogPostValidationMessages {
  ContentIsEmpty = 'The blog post text is empty',
  DescriptionIsEmpty = 'The blog post description is empty',
  TitleIsEmpty = 'The blog post title is empty',
  InvalidUserId = 'Invalid user id',
  CategoriesNotSpecified = 'The blog post categories are not specified',
  InvalidUUID = 'Invalid GUID'
}

export enum BlogPostQueryDefaults {
  DefaultCountLimit = 25,
  DefaultPageCount = 1,
  DefaultSearchByTitleLimit = 20
}

export enum BlogPostOperationDescription {
  ShowBlogPostById = 'Gets blog post details by id',
  CreateBlogPost = 'Creates blog post',
  ListBlogPosts = 'Lists blog posts based on search criteria',
  ListBlogPostsByUser = 'Lists user blog posts based on search criteria',
  DeleteBlogPostById = 'Deletes blog post by specified id',
  UpdateBlogPostById = 'Updates blog post by specified id',
  CreateCommentForBlogId = 'Creates blog post comment for specified blog post id',
  AddLikeToBlogPost = 'Adds like to specified blog post',
  PublishBlogPost = 'Publish blog post',
  RePostBlogPost = 'Re-post blog post',
  FindCreatedAfterDate = 'Gets all published blog posts created after specified date',
}

export enum BlogPostResponseMessage {
  ShowBlogPostById = 'Returned blog post details in response body',
  CreatedBlogPost = 'Returns created blog post details in response body',
  ListsBlogPosts = 'Returns blog posts list in response body',
  CreateCommentForBlogId = 'Blog comment was created and details returned in response body',
  RePostedBlogPost = 'Blog post was re-posted',
  FindCreatedAfterDate = 'Returns all published blog posts created after specified date',
}

export enum BlogPostResponseError {
  BlogNotFound = 'Blog post not found',
  UnauthorizedRequest = 'Unauthorized request',
  LikeAllowedForPublishedBlogPost = 'Like is allowed only for Published blog post',
  AuthorCanNotRePostOwnPost = "Author can not re-post own blog post",
  RePostAllowedForPublishedBlogPost = 'Re-post is allowed only for Published blog post',
  AlreadyRePosted = "Blog post already re-posted",
}
