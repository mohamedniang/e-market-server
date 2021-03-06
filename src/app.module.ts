import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { PostService } from './post/post.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SpaceModule } from './space/space.module';
import { StoredElementService } from './stored-element/stored-element.service';
import { StoredElementModule } from './stored-element/stored-element.module';
import { MulterModule } from '@nestjs/platform-express';
import { SpaceMiddleware } from './space/space.middleware';
import { LinkModule } from './link/link.module';
import { VerificationLinkModule } from './verification-link/verification-link.module';
import { RecoveryLinkModule } from './recovery-link/recovery-link.module';
import { EmailModule } from './email/email.module';
import { VideoCallModule } from './video-call/video-call.module';
import { RoleModule } from './role/role.module';
import { SmsService } from './sms/sms.service';
import { SmsModule } from './sms/sms.module';
import { TasksModule } from './tasks/tasks.module';
import { ApplicationModule } from './application/application.module';
import { ContactModule } from './contact/contact.module';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   ...config,
    //   synchronize: true,
    //   logging: false,
    //   // autoLoadEntities: true,
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   migrations: [__dirname + '/**/*.migrations{.ts,.js}'],
    //   subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
    // }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (conf: ConfigService) => ({
        type: 'mysql',
        host:
          conf.get('NODE_ENV') == 'production'
            ? conf.get('HOST_PROD')
            : conf.get('HOST_DEV'),
        port:
          conf.get('NODE_ENV') == 'production'
            ? conf.get('PORT_PROD')
            : conf.get('PORT_DEV'),
        username:
          conf.get('NODE_ENV') == 'production'
            ? conf.get('USERNAME_PROD')
            : conf.get('USERNAME_DEV'),
        password:
          conf.get('NODE_ENV') == 'production'
            ? conf.get('PASSWORD_PROD')
            : conf.get('PASSWORD_DEV'),
        database:
          conf.get('NODE_ENV') == 'production'
            ? conf.get('DATABASE_PROD')
            : conf.get('DATABASE_DEV'),
        extra: {
          charset: 'utf8mb4_unicode_ci',
        },
        synchronize: true,
        logging: false,
        // autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/**/*.migrations{.ts,.js}'],
        subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // dest: configService.getString('MULTER_DEST')
        storage: diskStorage({
          destination: configService.get('MULTER_DEST'),
          filename: (req, file, cb) => {
            const filename: string =
              path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const ext: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${ext}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    PostModule,
    UserModule,
    AuthModule,
    SpaceModule,
    StoredElementModule,
    LinkModule,
    VerificationLinkModule,
    RecoveryLinkModule,
    EmailModule,
    VideoCallModule,
    RoleModule,
    SmsModule,
    TasksModule,
    ApplicationModule,
    ContactModule,
  ],
  controllers: [AppController, PostController],
  providers: [AppService, PostService, StoredElementService, SmsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SpaceMiddleware)
      .forRoutes({ path: 'space/upload', method: RequestMethod.POST });
  }
}
