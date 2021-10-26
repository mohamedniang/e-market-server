import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// import * as ses from 'nodemailer-ses-transport';
import * as h2p from 'html2plaintext';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const aws = require('aws-sdk');

@Injectable()
export class EmailService {
  transporter: any;
  returnedData: any;
  constructor() {
    const ses = new aws.SES({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.transporter = nodemailer.createTransport({
      // SES: { ses, aws },

      // service: 'gmail',
      // auth: {
      //   user: 'mouhamedniang1997@gmail.com',
      //   pass: 'neguasapurqlaxej',
      // },

      host: 'smtp.verifieddealers.com',
      port: 465,
      secure: true,
      auth: {
        user: 'support@verifieddealers.com',
        pass: 'Th1sIsPa55word',
      },
    });
  }

  async send(email) {
    try {
      Logger.log(email, 'send email');
      email.text = h2p(email.html);

      const store = axios.create({
        responseType: 'stream',
      });
      await this.transporter.sendMail(email, (err, info) => {
        console.log('here', err, info);
        if (err) {
          this.returnedData = { error: 1, message: err };
          return;
        }
        this.returnedData = { response: info.response, email: email };
      });
      return this.returnedData;
    } catch (e) {
      console.log(`error`, e);
      return { error: 1, message: e };
    }
  }
}
