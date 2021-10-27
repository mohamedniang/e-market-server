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
    const platformUrl =
      this.conf.get('NODE_ENV') == 'development'
        ? this.conf.get('DEV_PLATFORM_SERVER_URL')
        : this.conf.get('PROD_PLATFORM_SERVER_URL');
    const app = await application.save();
    // send an email to admin
    console.log('new application, sending email to admin');
    await this.emailService.send({
      from: 'support@verifieddealers.com', // sender address
      to: ['mouhamedniang1997@gmail.com'], // list of receivers
      subject: 'New application', // Subject line
      text: `link: new application`, // plain text body
      html: `<p>link: <a href="${platformUrl}/admin/">new application</a></p>
              <table border="0">
                <tbody>
                  <tr><td>email</td><td>${app.email}</td></tr>
                  <tr><td>firstname</td><td>${app.firstname}</td></tr>
                  <tr><td>lastname</td><td>${app.lastname}</td></tr>
                  <tr><td>city</td><td>${app.address.city}</td></tr>
                  <tr><td>country</td><td>${app.address.country}</td></tr>
                  <tr><td>full</td><td>${app.address.full}</td></tr>
                  <tr><td>postalCode</td><td>${app.address.postalCode}</td></tr>
                  <tr><td>state</td><td>${app.address.state}</td></tr>
                  <tr><td>comment</td><td>${app.comment}</td></tr>
                  <tr><td>company</td><td>${app.company}</td></tr>
                  <tr><td>employees</td><td>${app.employees}</td></tr>
                  <tr><td>introduction</td><td>${app.introduction}</td></tr>
                  <tr><td>phone</td><td>${app.phone}</td></tr>
                  <tr><td>references 1</td><td>${app.references.reference1}</td></tr>
                  <tr><td>references 2</td><td>${app.references.reference2}</td></tr>
                  <tr><td>references 3</td><td>${app.references.reference3}</td></tr>
                  <tr><td>type</td><td>${app.type}</td></tr>
                  <tr><td>username</td><td>${app.username}</td></tr>
                  <tr><td>website</td><td>${app.website}</td></tr>
                  <tr><td>year</td><td>${app.year}</td></tr>
                </tbody>
              </table>
              `, // html body
    }); // send to {user} a new email
    await this.emailService.send({
      from: 'support@verifieddealers.com', // sender address
      to: app.email, // list of receivers
      subject: 'New application', // Subject line
      text: `Hi ${app.firstname} ${app.lastname},

      Thanks for filling out the new member application form.
      Someone will review your submission and we'll get back to you as soon as possible,
      
      Regards,
      Abe
      `, // plain text body
      html: `<h3>Hi ${app.firstname} ${app.lastname}</h3>,

        <p>
          Thanks for filling out the new member application form.
          Someone will review your submission and we'll get back to you as soon as possible,
        </p>
        
        <p>Regards,</p>
        <p>Abe</p>
        <img width="200" src="https://www.verifieddealers.com/cms/uploads/verified_Dealers_Footer_b216a0e082.png" alt="verifed dealers logo" />
      `, // html body
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
