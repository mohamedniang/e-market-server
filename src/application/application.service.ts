import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { Application } from './application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    private emailService: EmailService,
    private conf: ConfigService,
  ) {}
  async create(application: Application) {
    const landingUrl =
      this.conf.get('NODE_ENV') == 'development'
        ? this.conf.get('DEV_SERVER_URL')
        : this.conf.get('PROD_SERVER_URL');
    const app = await application.save();
    // send an email to admin
    console.log('new application, sending email to admin');
    await this.emailService.send({
      from: 'support@verifieddealers.com', // sender address
      to: ['abe@dawser.com', 'mouhamedniang1997@gmail.com'], // list of receivers
      subject: 'New application', // Subject line
      text: `link: new application`, // plain text body
      html: `<p>link: <a href="${landingUrl}/application/${app.id}">new application</a></p>`, // html body
    }); // send to {user} a new email
    return app;
  }

  async findAll() {
    return await Application.find();
  }

  async findOne(id: string) {
    console.log(`finding by #${id} application`);
    return await Application.findOne({ where: { id } });
  }

  async update(id: string, user: any) {
    console.log(`This action updates a #${id} application`);
    const newUser = new Application();
    newUser.id = id;
    return await Object.assign(newUser, user).save();
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
