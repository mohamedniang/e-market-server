import {
  Controller,
  Get,
  Post as httpPost,
  Logger,
  Body,
  Req,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getPost(): Promise<Post[]> {
    Logger.log('inside post.controller', 'Post');
    return await this.postService.getAllPost();
  }
  @httpPost()
  async addPost(@Body() body: Post) {
    console.log('body', body);
    return await this.postService.addPost(body);
  }
  @Delete(':id')
  async deletePost(@Param('id', new ParseIntPipe()) id: number) {
    console.log('id', id);
    return await this.postService.deletePost(id);
  }
}
