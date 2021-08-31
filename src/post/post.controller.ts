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
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  // @UseGuards(AuthGuard())
  async getPost(@Req() req): Promise<Post[]> {
    Logger.log('inside post.controller', 'Post');
    console.log(req.user);
    return await this.postService.getAllPost();
  }

  @Get('admin')
  @UseGuards(AuthGuard(), RoleGuard)
  @Role('admin')
  async getAllPost(): Promise<Post[]> {
    return await this.postService.getAllPostAdmin();
  }

  @Get(':id')
  // @UseGuards(AuthGuard())
  async getOnePost(@Param('id') id: string) {
    return await this.postService.getOnePost(id);
  }
  @Get('edit/:id')
  @UseGuards(AuthGuard())
  async getOnePostForEdit(@Param('id') id: string, @Req() req) {
    console.log(`user`, req.user);
    const res = await this.postService.getOnePost(id);
    if (res.owner.id != req.user.id)
      return {
        error: 1,
        message: "You can't edit a post that you do not own",
      };
    return res;
  }

  @Get('user/:id')
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

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(@Param('id', new ParseIntPipe()) id: number, @Body() post: any) {
    console.log('updating post', id, post);
    return this.postService.update(+id, post);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deletePost(@Param('id', new ParseIntPipe()) id: number) {
    console.log('id', id);
    return await this.postService.deletePost(id);
  }
}
