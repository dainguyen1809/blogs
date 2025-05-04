import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog APIs',
      version: '1.0.0',
      description: 'A sample Express.js API built with TypeScript and Swagger'
    }
  },
  apis: ['./src/routes/**/*.ts']
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
