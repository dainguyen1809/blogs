import { winstonLogger } from '@src/core/utils/helpers';
import { Logger } from 'winston';
import { config } from '@src/infra/configs';
import { Client } from '@elastic/elasticsearch';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, '[ Elasticsearch Server ]', 'debug');

const elasticsearchClient = new Client({
  node: `${config.ELASTICSEARCH_URL}`
});

export const checkConnection = async () => {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health = await elasticsearchClient.cluster.health({});
      log.info(`[ Elasticsearch Server ] health status - ${health.status} 🌱`);

      isConnected = true;
    } catch (error) {
      log.log('error', '❌ [ Elasticsearch Server ] method checkConnection() occurred error: ', error);
    }
  }
};
