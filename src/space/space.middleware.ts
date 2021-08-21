/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

@Injectable()
export class SpaceMiddleware implements NestMiddleware {
  upload: any;
  constructor(private readonly configService: ConfigService) {
    // Set S3 endpoint to DigitalOcean Spaces
    const spacesEndpoint = new aws.Endpoint('fra1.digitaloceanspaces.com');
    const s3 = new aws.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.DO_ACCESS_KEY_ID,
      secretAccessKey: process.env.DO_SECRET_ACCESS_KEY,
    });
    // Change bucket property to your Space name
    this.upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: process.env.DO_BUCKET,
        acl: 'public-read',
        key: function (request, file, cb) {
          console.log('inside multer function', file);
          cb(null, file.originalname);
        },
      }),
    }).single('file'); //array('file', 1);
  }
  use(req: Request, res: Response, next: NextFunction) {
    this.upload(req, res, next);
    // next();
  }
}
