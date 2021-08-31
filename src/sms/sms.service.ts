import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  // Download the helper library from https://www.twilio.com/docs/node/install
  // Find your Account SID and Auth Token at twilio.com/console
  // and set the environment variables. See http://twil.io/secure
  private accountSid = process.env.TWILIO_ACCOUNT_SID;
  private authToken = process.env.TWILIO_AUTH_TOKEN;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  private client = require('twilio')(this.accountSid, this.authToken);
  async send(to, body) {
    return this.client.messages
      .create({
        body,
        from: '+13123456300',
        to,
      })
      .then((message) => message.sid)
      .catch((err) => ({ error: 1, message: err }));
  }
}
