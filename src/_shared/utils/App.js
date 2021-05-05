const appContext = require('../database/AppContext');
const express = require('express');
const routerLoader = require('./routesLoader');

const database = require('../multiple-clients-mongo');

class App {
  constructor() {
    if (!process.env.PORT) {
      process.env.PORT = 80;
    }

    if (!process.env.MONGO_PORTAL && process.env.MONGODB_USERNAME) {
      process.env.MONGO_PORTAL = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DATABASE}?${process.env.MONGODB_OPTIONS}`;
      process.env.MONGO_METRICS = process.env.MONGO_PORTAL;
    }

    if (!process.env.MONGODB_DATABASE) {
      process.env.MONGODB_DATABASE = 'prod';
    }

    this.port = process.env.PORT || 4000;
  }

  async init() {
    appContext.connect();

    // database.connect('PARAMETRIZATION', process.env.MONGO_PORTAL);
    // database.connect('METRICS', process.env.MONGO_METRICS);

    this.sever = express();
    this.sever.use(express.json());

    routerLoader(this.sever);
    const server = this.sever.listen(this.port || 4000);
    require('./healthcheck')(server);
    console.log(`API server is listening on port ${this.port}! :)`);
  }
}

module.exports = new App();
