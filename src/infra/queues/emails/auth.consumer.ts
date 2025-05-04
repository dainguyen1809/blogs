import { IEmailLocals } from '@src/core/interfaces';
import { winstonLogger } from '@src/core/utils/helpers';
import { config, connectToRabbitMQ } from '@src/infra/configs';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { sendEmail } from '@src/infra/queues/emails';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, '[ Authentication Email Consumer ]', 'debug');

export const consumerAuthEmailMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await connectToRabbitMQ()) as Channel;
    }

    const exchangeName = 'auth_email_notification';
    const routingKey = 'auth_email';
    const queueName = 'auth_email_queue';

    await channel.assertExchange(exchangeName, 'direct', { durable: true });
    const queueInfo = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(queueInfo.queue, exchangeName, routingKey);

    channel.consume(queueInfo.queue, async (msg: ConsumeMessage) => {
      const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString());

      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: '',
        username,
        verifyLink,
        resetLink
      };

      await sendEmail(template, receiverEmail, locals);

      channel.ack(msg);
    });
  } catch (error) {
    log.log('error', '❌ [ Application ] method startServer() occurred error: ', error);
  }
};
