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
        url: `http://localhost:${process.env.BACKEND_PORT}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/docs/*.js'],
});

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
