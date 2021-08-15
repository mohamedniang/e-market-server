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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  // @UseGuards(AuthGuard())
  async getPost(): Promise<Post[]> {
    Logger.log('inside post.controller', 'Post');
    return await this.postService.getAllPost();
  }

  @httpPost()
  @UseGuards(AuthGuard())
  async addPost(@Body() user: Post) {
    console.log('body', user);
    return await this.postService.addPost(user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deletePost(@Param('id', new ParseIntPipe()) id: number) {
    console.log('id', id);
    return await this.postService.deletePost(id);
  }
}
