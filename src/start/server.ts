import { winstonLogger } from '@src/core/utils/helpers';
import { config } from '@src/infra/configs';
import { Logger } from 'winston';
import { start } from './app';
import express, { Express } from 'express';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, '[ Application ]', 'debug');

const initialize = (): void => {
  const app: Express = express();
  start(app);
  log.info(`[ Server ] Initialized successfully ✅`);
};

initialize();
