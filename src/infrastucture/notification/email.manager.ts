import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class EmailManager {
  async sendConfirmMail(user) {
    const transporter = await nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'yuraovdnk@gmail.com',
        pass: 'puoowkujaurxnden',
      },
    });
    const info = await transporter.sendMail({
      from: '"Yura" <yuraovdnk@gmail.com>',
      to: user.accountData.email,
      subject: 'Confrim Email',

      text: `https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}`,
    });
    return info;
  }
}
