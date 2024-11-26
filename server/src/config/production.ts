export const productionConfig = {
    // Allowed origins for CORS
    allowedOrigins: [
      'https://your-render-frontend-url.onrender.com',
      'https://your-render-backend-url.onrender.com'
    ],
    
    // MongoDB config
    mongoDbConfig: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    }
  };