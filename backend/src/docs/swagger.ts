export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'E-commerce API',
    version: '1.0.0',
    description: 'API documentation for the E-commerce platform',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  paths: {
    '/analytics': {
      get: {
        summary: 'Get Analytics',
        description: 'Retrieves total orders and total revenue',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean'
                    },
                    data: {
                      type: 'object',
                      properties: {
                        totalOrders: {
                          type: 'integer'
                        },
                        totalRevenue: {
                          type: 'number'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export default swaggerSpec;
