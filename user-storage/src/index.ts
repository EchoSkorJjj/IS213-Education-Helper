import dotenv from 'dotenv';

import Server from './server/server';

dotenv.config();

const server: Server = Server.getInstance();
server.start();