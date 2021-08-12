import { Injectable, Logger } from '@nestjs/common';
import { PostEntity } from './post.entity';

@Injectable()
export class PostService {
  constructor() {
    Logger.log('init', 'Post');
  }

  async getAllPost() {
    return PostEntity.createQueryBuilder('post').getMany();
  }

  addPost(post: PostEntity) {
    return post.save();
  }

  deletePost(id: number) {
    return PostEntity.createQueryBuilder('post_entity')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
