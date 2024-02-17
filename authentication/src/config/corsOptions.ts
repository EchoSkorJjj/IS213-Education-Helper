import * as cors from 'cors';

const development: cors.CorsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:8000',
    'https://localhost:443',
    'https://localhost:80',
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const production: cors.CorsOptions = {
  origin: [], // Add your production domains here, e.g., ['https://yourproductiondomain.com']
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 600, // 10 minutes
  /*
   * allowedHeaders: ['Content-Type', 'Authorization'],
   * exposedHeaders: ['Content-Range', 'X-Content-Range'],
   */
};

export const corsOptions: cors.CorsOptions =
  process.env.NODE_ENV === 'production' ? production : development;
