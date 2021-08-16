import { Injectable, Logger } from '@nestjs/common';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor() {
    Logger.log('init', 'Post');
  }

  async getAllPost() {
    return Post.createQueryBuilder('post')
      .leftJoinAndSelect('post.owner', 'owner')
      .getMany();
  }

  async getAllUserPost(id: string) {
    return Post.find({ where: { owner: { id } }, relations: ['owner'] });
  }

  async getOnePost(id: string) {
    return Post.findOne({ where: { id }, relations: ['owner'] });
  }

  addPost(post: Post) {
    return post.save();
  }

  deletePost(id: number) {
    return Post.createQueryBuilder('post_entity')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
