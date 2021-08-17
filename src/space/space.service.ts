/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
// import { S3 } from 'aws-sdk';
// import { Logger } from '@nestjs/common';
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

@Injectable()
export class SpaceService {
  public async upload(req, res, next) {
    try {
      aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      // Set S3 endpoint to DigitalOcean Spaces
      const spacesEndpoint = new aws.Endpoint('fra1.digitaloceanspaces.com');
      const s3 = new aws.S3({
        endpoint: spacesEndpoint,
      });
      // Change bucket property to your Space name
      const uploadd = multer({
        storage: multerS3({
          s3: s3,
          bucket: 'iphone-flipping',
          acl: 'public-read',
          key: function (request, file, cb) {
            console.log('inside multer function', file);
            cb(null, file.originalname);
          },
        }),
      }).array('upload', 1);
      await uploadd(req, res, next);
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  // async upload(file) {
  //   const { originalname } = file;
  //   const bucketS3 = process.env.AWS_BUCKET;
  //   await this.uploadS3(file.buffer, bucketS3, originalname);
  // }

  // async uploadS3(file, bucket, name) {
  //   const s3 = this.getS3();
  //   const params = {
  //     Bucket: bucket,
  //     Key: String(name),
  //     Body: file,
  //   };
  //   return new Promise((resolve, reject) => {
  //     s3.upload(params, (err, data) => {
  //       if (err) {
  //         Logger.error(err);
  //         reject(err.message);
  //       }
  //       resolve(data);
  //     });
  //   });
  // }

  // getS3() {
  //   return new S3({
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //     region: process.env.AWS_REGION,
  //   });
  // }
}
