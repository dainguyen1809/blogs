import { config } from '@src/infra/configs';
import { Logger } from 'winston';
import { winstonLogger } from '@src/core/utils/helpers/';
import { IEmailLocals } from '@src/core/interfaces';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';
import path from 'path';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, '[ Email Transport Helper ]', 'debug');

export const emailTemplates = async (template: string, receiver: string, locals: IEmailLocals): Promise<void> => {
  try {
    const stmpTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `${config.SENDER_EMAIL}`,
        pass: `${config.SENDER_EMAIL_PASSWORD}`
      }
    });

    // const stmpTransporter = nodemailer.createTransport({
    //   host: 'smtp.ethereal.email',
    //   port: 587,
    //   auth: {
    //     user: 'lacey.rodriguez@ethereal.email',
    //     pass: 'Y6zBqDhEQ56K7tuXdt'
    //   }
    // });

    // init email object
    const email = new Email({
      message: {
        from: `DHN Blog <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: stmpTransporter,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true, //inline css to html
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });

    await email.send({
      template: path.join(__dirname, '..', '../../infra/storages/templates', template), // absolute path
      message: { to: receiver }, // receiver
      locals // put variables into ejs
    });
  } catch (error) {
    log.log('error', '❌ [ Email Transport Helper ] method emailTemplates() occurred error: ', error);
  }
};
