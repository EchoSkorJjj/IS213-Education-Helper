import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { config } from 'dotenv';
import * as express from 'express';

import { corsOptions } from './config/corsOptions';
import logger from './logging/logger';
import authRoute from './routes/auth.routes';

// Debugging: Check if the .env file is being loaded
const result = config();
if (result.error) {
  logger.error('Error loading .env file:', result.error);
} else {
  logger.info('Loaded .env file successfully');
}
const app = express();
const port = process.env.SERVER_PORT || 80;

if (!process.env.SERVER_PORT) {
  logger.error('Port is not defined, falling back to 3000');
}

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  logger.info(`Server is running at port ${port}`);
});

app.use('/auth', authRoute);
