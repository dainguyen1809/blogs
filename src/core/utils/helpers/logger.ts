import winston, { info, Logger } from 'winston';
import symbols from 'log-symbols';
import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch';

// convert log from the original format of Winston to standard format Elasticsearch
const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
};

// setup logger
export const winstonLogger = (elasticsearchNode: string, name: string, level: string): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      }
    }
  };

  const esTransport = new ElasticsearchTransport(options.elasticsearch);

  const logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [
      new winston.transports.Console({
        level,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ level, message, timestamp }) => {
            return `\t${timestamp} ${symbols[level] || ''} ${level}: ${message}`;
          })
        )
      }),
      esTransport
    ]
  });

  return logger;
};
