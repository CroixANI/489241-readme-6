import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PaginationResult, Post, PostState } from '@project/shared-core';
import { BasePostgresRepository } from '@project/data-access';
import { PrismaClientService } from '@project/blog-models';

import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostQuery } from './dto/blog-post.query';
import { BlogPostSortByType } from './blog-port-sort-type.enum';

@Injectable()
export class BlogPostRepository extends BasePostgresRepository<BlogPostEntity, Post> {
  constructor(
    entityFactory: BlogPostFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client)
  }

  private async getPostCount(where: Prisma.PostWhereInput): Promise<number> {
    return this.client.post.count({ where });
  }

  private calculatePostsPage(totalCount: number, limit: number): number {
    return Math.ceil(totalCount / limit);
  }

  public async save(entity: BlogPostEntity): Promise<void> {
    const pojoEntity = entity.toPOJO();
    const record = await this.client.post.create({
      data: {
        ...pojoEntity,
        categories: {
          connect: pojoEntity.categories.map(({ id }) => ({ id }))
        },
        comments: {
          connect: [],
        }
      }
    });

    entity.id = record.id;
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.post.delete({
      where: {
        id
      }
    });
  }

  public async findById(id: string): Promise<BlogPostEntity> {
    const document = await this.client.post.findFirst({
      where: {
        id,
      },
      include: {
        categories: true,
        comments: true,
      }
    });

    if (! document) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    return this.createEntityFromDocument(document);
  }

  public async findByOriginalPostId(id: string): Promise<BlogPostEntity> {
    const document = await this.client.post.findFirst({
      where: {
        originalPostId: id,
      },
      include: {
        categories: true,
        comments: true,
      }
    });

    return this.createEntityFromDocument(document);
  }

  public async update(entity: BlogPostEntity): Promise<void> {
    const pojoEntity = entity.toPOJO();
    await this.client.post.update({
      where: { id: entity.id },
      data: {
        title: pojoEntity.title,
        content: pojoEntity.content,
        description: pojoEntity.description,
        categories: {
          set: pojoEntity.categories.map((category) => ({ id: category.id })),
        }
      },
      include: {
        categories: true,
        comments: true,
      }
    });
  }

  public async find(query?: BlogPostQuery): Promise<PaginationResult<BlogPostEntity>> {
    const skip = query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const take = query?.limit;
    const where: Prisma.PostWhereInput = {};
    const orderBy: Prisma.PostOrderByWithRelationInput = {};

    if (query?.categories) {
      where.categories = {
        some: {
          id: {
            in: query.categories
          }
        }
      }
    }

    if (query?.sortDirection) {
      this.setSortPropertyAndDirection(query, orderBy);
    }

    if (query?.type) {
      where.type = query.type;
    }

    if (query?.authorId) {
      where.userId = query.authorId;
    }

    if (query?.postState) {
      where.state = query.postState;
    }

    const [records, postCount] = await Promise.all([
      this.client.post.findMany({ where, orderBy, skip, take,
        include: {
          categories: true,
          comments: true,
        },
      }),
      this.getPostCount(where),
    ]);

    return {
      entities: records.map((record) => this.createEntityFromDocument(record)),
      currentPage: query?.page,
      totalPages: this.calculatePostsPage(postCount, take),
      itemsPerPage: take,
      totalItems: postCount,
    }
  }

  public async saveChangedLikes(entity: BlogPostEntity): Promise<void> {
    const pojoEntity = entity.toPOJO();
    await this.client.post.update({
      where: { id: entity.id },
      data: { likes: pojoEntity.likes, likesCount: pojoEntity.likesCount }
    });
  }

  public async saveChangedState(entity: BlogPostEntity): Promise<void> {
    const pojoEntity = entity.toPOJO();
    await this.client.post.update({
      where: { id: entity.id },
      data: { state: pojoEntity.state }
    });
  }

  public async rePost(entity: BlogPostEntity, userId: string): Promise<BlogPostEntity> {
    const { id, ...pojoEntity } = entity.toPOJO();

    const record = await this.client.post.create({
      data: {
        ...pojoEntity,
        id: undefined,
        title: pojoEntity.title,
        state: PostState.Draft,
        originalPostId: id,
        userId,
        categories: {
          connect: pojoEntity.categories.map(({ id }) => ({ id }))
        },
        comments: {
          connect: [],
        }
      },
      include: {
        categories: true,
        comments: true,
      }
    });

    return this.createEntityFromDocument(record);
  }

  public async findCreatedAfterDate(date: Date): Promise<BlogPostEntity[]> {
    const posts = await this.client.post.findMany({
      where: { createdAt: { gt: date }, state: PostState.Published },
      include: { comments: true, categories: true }
    });

    return posts.map(post => this.createEntityFromDocument(post));
  }

  private setSortPropertyAndDirection(query: BlogPostQuery, orderBy: Prisma.PostOrderByWithRelationInput) {
    if (query?.sortProperty == BlogPostSortByType.CreatedBy) {
      orderBy.createdAt = query.sortDirection;
    } else if (query?.sortProperty == BlogPostSortByType.CommentsCount) {
      orderBy.comments = { _count: query.sortDirection };
    } else if (query?.sortProperty == BlogPostSortByType.LikesCount) {
      orderBy.likesCount = query.sortDirection;
    }
  }
}


