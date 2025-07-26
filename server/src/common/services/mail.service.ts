import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { config } from '../../config/config';
import MailTemplate from '../email-templates';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
    host: config().nodemailer.host,
    port: config().nodemailer.port,
    secure: config().nodemailer.secure,
    auth: {
      user: config().nodemailer.auth.user,
      pass: config().nodemailer.auth.pass,
    },
  } as SMTPTransport.Options);

  public async confirmEmail(email: string, code: string): Promise<void> {
    try {
      await this.transporter.sendMail(MailTemplate.confirmEmail(email, code));
      Logger.log(`MailService.confirmEmail send correctly`);
    } catch (error) {
      throw new InternalServerErrorException('Failed to function MailService.confirmEmail : ' + error.message);
    }
  }
}
