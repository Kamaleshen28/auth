const express = require('express');
const router = require('./src/routes/routes');
const port = 7000;
const cors = require('cors');
const { createClient } = require('redis');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin:'*'
}));
app.use('/', router);




//FOR config.json
// "host": "db",
// "dialect": "postgres",
// "port":5432

const config = {
  socket: {
    // eslint-disable-next-line no-undef
    host: process.env.REDIS_HOST,
    // eslint-disable-next-line no-undef
    port: process.env.REDIS_PORT,
  },
};
global.redisClient = createClient(config);


// global.redisClient = createClient();

// eslint-disable-next-line no-undef
redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});

// eslint-disable-next-line no-undef
redisClient
  .connect()
  .then(() => {
    console.log('Redis connected');
  })
  .catch((err) => {
    console.log('Redis Screwed UP: ', err);
  });

app.listen(port, () => {
  console.log(`Auth Server started at port ${port}`);
});

