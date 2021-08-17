import {
  Body,
  Controller,
  Next,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StoredElement } from 'src/stored-element/stored-element.entity';
import { SpaceService } from './space.service';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file, @Req() req) {
    try {
      console.log(`file`, file);
      const element = new StoredElement();
      element.name = file.originalname;
      element.type = file.mimetype;
      element.location = file.location;
      return await element.save();
    } catch (e) {
      return {
        error: 1,
        message: 'error while uploading image',
      };
    }
    // return await this.spaceService.upload(req, res, (err) => {
    //   if (err) {
    //     console.log(err);
    //     return res.status(400).json({ errors: err });
    //   }

    //   return res.status(200).json({ message: 'File uploaded successfully.' });
    // });
  }
}
