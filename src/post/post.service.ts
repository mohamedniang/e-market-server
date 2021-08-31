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
      .where({ isDeleted: false })
      .orderBy('post.created_at', 'DESC')
      .getMany();
  }

  async getAllPostAdmin() {
    return Post.createQueryBuilder('post')
      .leftJoinAndSelect('post.owner', 'owner')
      .orderBy('post.created_at', 'DESC')
      .getMany();
  }

  async getAllUserPost(id: string) {
    return Post.find({ where: { owner: { id } }, relations: ['owner'] });
  }

  async getOnePost(id: string) {
    return Post.findOne({ where: { id }, relations: ['owner', 'thumbnail'] });
  }

  addPost(post: Post) {
    return post.save();
  }

  async update(id: number, post: any) {
    console.log(`This action updates a #${id} post`);
    const newPost = new Post();
    newPost.id = id;
    return await Object.assign(newPost, post).save();
  }

  async deletePost(id: number) {
    const post = await Post.findOneOrFail({ where: { id } });
    post.isDeleted = true;
    return post.save();
    // return Post.createQueryBuilder('post')
    //   .delete()
    //   .where('id = :id', { id })
    //   .execute();
  }
}
