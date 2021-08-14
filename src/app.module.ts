import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { PostService } from './post/post.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
let config = {};
if (process.env.NODE_ENV == 'production') {
  config = {
    type: process.env.TYPE,
    host: process.env.HOST,
    port: process.env.PORT,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  };
} else {
  config = {
    type: 'mysql',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '',
    database: 'market',
  };
}
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config,
      synchronize: true,
      logging: false,
      // autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/**/*.migrations{.ts,.js}'],
      subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, PostController],
  providers: [AppService, PostService],
})
export class AppModule {}
