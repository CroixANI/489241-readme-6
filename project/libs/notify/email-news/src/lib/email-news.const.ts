export enum EmailNewsErrors {
  NewPostsIsRequired = 'Lists of new blog posts should not be empty',
}

export enum EmailNewsProperties {
  NewPosts = 'List of new recent blog posts',
  SentDate = 'Date when new blog post notification was sent'
}

export enum NewPostsOperationDescription {
  LastNotification = 'Gets details about last sent notification'
}

export enum NewPostsResponseMessage {
  LastNotification = 'Returns details about last sent notification in response body'
}
