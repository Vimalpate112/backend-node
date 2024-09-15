import swaggerAutogen from 'swagger-autogen';

const outputFile = './src/swagger_output.json';
const endpointsFiles = ['./src/routes/index.route.ts'];

const doc = {
  info: {
    title: 'My API',
    description: 'Description of my API',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  definitions: {
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
