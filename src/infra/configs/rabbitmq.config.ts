import { winstonLogger } from '@src/core/utils/helpers';
import { Logger } from 'winston';
import { config } from '@src/infra/configs';
import { Channel, connect, Connection } from 'amqplib';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, '[ RabbitMQ Server ]', 'debug');

export const connectToRabbitMQ = async (): Promise<Channel | undefined> => {
  try {
    const connection = await connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel = await connection.createChannel();

    log.info('[ RabbitMQ Server ] connected to queue successfully ✅');
    closeConnection(channel, connection);

    return channel;
  } catch (error) {
    log.log('error', '❌ [ RabbitMQ Server ] method connectToRabbitMQ() occurred error: ', error);
    return undefined;
  }
};

const closeConnection = async (channel, connection): Promise<void> => {
  channel.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
};
