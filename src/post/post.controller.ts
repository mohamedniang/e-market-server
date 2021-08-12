import {
  Controller,
  Get,
  Post,
  Logger,
  Body,
  Req,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getPost(): Promise<PostEntity[]> {
    Logger.log('inside post.controller', 'Post');
    return await this.postService.getAllPost();
  }
  @Post()
  async addPost(@Body() body: PostEntity) {
    console.log('body', body);
    return await this.postService.addPost(body);
  }
  @Delete(':id')
  async deletePost(@Param('id', new ParseIntPipe()) id: number) {
    console.log('id', id);
    return await this.postService.deletePost(id);
  }
}
