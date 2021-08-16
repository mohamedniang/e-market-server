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

  @Get(':id')
  // @UseGuards(AuthGuard())
  async getOnePost(@Param('id') id: string) {
    return await this.postService.getOnePost(id);
  }

  @Get('user/:id')
  // @UseGuards(AuthGuard())
  async getUserPost(@Param('id') id: string): Promise<Post[]> {
    return await this.postService.getAllUserPost(id);
  }

  @httpPost()
  @UseGuards(AuthGuard())
  async addPost(@Body() post: any) {
    console.log('body', post);
    post = Object.assign(new Post(), post);
    return await this.postService.addPost(post);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deletePost(@Param('id', new ParseIntPipe()) id: number) {
    console.log('id', id);
    return await this.postService.deletePost(id);
  }
}
