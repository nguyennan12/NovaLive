import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'Livetream Ecommerce API',
    description: 'Tài liệu API tự động tạo bởi swagger-autogen',
  },
  host: 'localhost:3000',
  schemes: ['http'],
}

const outputFile = './src/config/swagger-output.json'
const endpointsFiles = ['./src/routes/v1/index.js']

// Chạy hàm generate
swaggerAutogen(outputFile, endpointsFiles, doc)