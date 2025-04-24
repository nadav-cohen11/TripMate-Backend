import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = Object.freeze({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TripMate API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
});

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
