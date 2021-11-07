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
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import { StoredElement } from 'src/stored-element/stored-element.entity';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Controller('post')
export class PostController {
  constructor(
    private configService: ConfigService,
    private readonly postService: PostService,
  ) {
    this.serverUrl =
      this.configService.get('NODE_ENV') == 'development'
        ? this.configService.get('DEV_API_SERVER_URL')
        : this.configService.get('PROD_API_SERVER_URL');
  }
  private serverUrl: string;

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

  @httpPost('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('PostController#uploadFile@file', file);
    const element = new StoredElement();
    element.name = file.originalname;
    element.type = file.mimetype;
    element.location = `${this.serverUrl}/post/image/${file.filename}`;
    return await element.save();
    // return of({ filename: file.filename });
  }

  @Get('image/:filename')
  getPostImage(@Param('filename') filename, @Res() res) {
    return res.sendFile(join(process.cwd(), `files/${filename}`));
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
