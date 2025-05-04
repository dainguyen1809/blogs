import compression from 'compression';
import dotenv from 'dotenv';
import express, { Application, Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import helmet from 'helmet';
import morgan from 'morgan';
import { healthRoute } from '@src/start/routes';
import { checkConnection, config, connectToRabbitMQ } from '@src/infra/configs';
import { winstonLogger } from '@src/core/utils/helpers';
import { Logger } from 'winston';
import { Channel } from 'amqplib';
import { consumerAuthEmailMessages } from '@src/infra/queues/emails';
import { IEmailContents } from '@src/core/interfaces';

const SERVER_PORT = process.env.APP_PORT || 3005;

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, '[ Application ]', 'debug');

export const start = (app: Application): void => {
  // necessary middleware
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('health', healthRoute());

  startQueues();

  startElasticsearch();
};

const startQueues = async (): Promise<void> => {
  // send email to consumers
  const emailChannel = (await connectToRabbitMQ()) as Channel;

  await consumerAuthEmailMessages(emailChannel);
  // const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=UdMiLixNTv2oApJC9N_RiQ`;

  // const messageDetails: IEmailContents = {
  //   receiverEmail: `test@gmail.com`,
  //   verifyLink: verificationLink,
  //   template: 'verifyEmail'
  // };

  // const emailVerification = JSON.stringify(messageDetails);
  // emailChannel.publish('auth_email_notification', 'auth_email', Buffer.from(emailVerification));
};

const startElasticsearch = (): void => {
  checkConnection();
};

const startServer = (app: Application): void => {
  try {
    const server = new http.Server(app);

    log.info(`Worker with process id of ${process.pid} on [ Notification Server ] has started ✅`);

    server.listen(SERVER_PORT, () => {
      log.info(`[ Application ] is running on port ${SERVER_PORT}`);
    });

    process.on('SIGINT', () => {
      server.close(() => log.info(`[ Application ] Application exited`));
    });
  } catch (error) {
    log.log('error', '[ Application ] method startServer() occurred error: ', error);
  }
};
