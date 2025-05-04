import { IEmailLocals } from '@src/core/interfaces';
import { winstonLogger } from '@src/core/utils/helpers';
import { emailTemplates } from '@src/core/utils/helpers/email-template';
import { config } from '@src/infra/configs';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, '[ Email Transport ]', 'debug');

export const sendEmail = async (template: string, receiver: string, locals: IEmailLocals): Promise<void> => {
  try {
    emailTemplates(template, receiver, locals);
    log.info('Email Sent successfully ✅');
  } catch (error) {
    log.log('error', '❌ [ Email Transport ] method sendEmail() occurred error: ', error);
  }
};
