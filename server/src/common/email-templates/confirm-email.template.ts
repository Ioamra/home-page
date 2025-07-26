import { config } from '../../config/config';
import { EmailResponse } from '../models/email.model';

export const confirmEmail = (mail: string, code: string): EmailResponse => {
  return {
    from: '"HomePageCustom" <homepagecustom@gmail.com>',
    to: config().devMode ? config().nodemailer.mailDev : mail,
    subject: 'Code de vérification',
    text: `
    Voici ton code de vérification: ${code}\n
    Ce code est valable 15 minutes.\n
    Si tu n'as pas demandé de code de vérification, ignore ce mail.`,
    html: `
    <p>Voici ton code de vérification: ${code}</p>
    <p>Ce code est valable 15 minutes.</p>
    <p>Si tu n'as pas demandé de code de vérification, ignore ce mail.</p>`,
  };
};
