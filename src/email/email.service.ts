import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// import * as ses from 'nodemailer-ses-transport';
import * as h2p from 'html2plaintext';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const aws = require('aws-sdk');

@Injectable()
export class EmailService {
  transporter: any;
  returnedData: any;

  constructor(private conf: ConfigService) {
    // const ses = new aws.SES({
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //   region: process.env.AWS_REGION,
    // });
    this.transporter = nodemailer.createTransport({
      // SES: { ses, aws },

      // service: 'gmail',
      // auth: {
      //   user: 'mouhamedniang1997@gmail.com',
      //   pass: 'neguasapurqlaxej',
      // },

      host: process.env.SMTP_VD_HOST,
      port: process.env.SMTP_VD_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_VD_USER,
        pass: process.env.SMTP_VD_PASSWORD,
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

  async sendContactMessage(contact) {
    const platformUrl =
      this.conf.get('NODE_ENV') == 'development'
        ? this.conf.get('DEV_PLATFORM_SERVER_URL')
        : this.conf.get('PROD_PLATFORM_SERVER_URL');
    const email = {
      from: 'support@verifieddealers.com', // sender address
      to: ['abe@dawser.com', 'mouhamedniang1997@gmail.com'], // list of receivers
      subject: 'New Contact Form', // Subject line
      text: ``, // plain text body
      html: `
              <h3>The details are:</h3>
              <table border="0">
                <tbody>
                  <tr><td>Email</td><td>${contact.email}</td></tr>
                  <tr><td>Firstname</td><td>${contact.firstname}</td></tr>
                  <tr><td>Lastname</td><td>${contact.lastname}</td></tr>
                  <tr><td>Phone</td><td>${contact.phone}</td></tr>
                  <tr><td>Message</td><td>${contact.message}</td></tr>
                </tbody>
              </table>
              `, // html body
    };
    return await this.send(email);
  }
}
