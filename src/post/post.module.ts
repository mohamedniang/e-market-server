import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { PostService } from './post.service';

@Module({
  imports: [UserModule, AuthModule],
  providers: [PostService],
})
export class PostModule {}
