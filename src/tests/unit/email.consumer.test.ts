import * as connection from '@src/infra/configs';
import { consumerAuthEmailMessages } from '@src/infra/queues/emails';
import amqp from 'amqplib';

jest.mock('@src/infra/configs/rabbitmq.config');
jest.mock('amqplib');
jest.mock('@src/core/interfaces');

describe('Email consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // usecases

  describe('consumerAuthEmailMessages', () => {
    it('Should be called', async () => {
      // channel mock
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };

      // mock function
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'auth_email_queue', messageCount: 0, consumerCount: 0 });
      jest.spyOn(connection, 'connectToRabbitMQ').mockReturnValue(channel as never);

      const connectionChannel = await connection.connectToRabbitMQ();
      await consumerAuthEmailMessages(connectionChannel);

      // Assertions
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('auth_email_notification', 'direct', { durable: true });
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('auth_email_queue', 'auth_email_notification', 'auth_email');
    });
  });
});
