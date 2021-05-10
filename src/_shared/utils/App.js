const appContext = require('../database/AppContext');
const express = require('express');
const bodyParser = require('body-parser');
const routerLoader = require('./routesLoader');
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

    this.sever = express();
    this.sever.use(bodyParser.urlencoded({ extended: true }));
    this.sever.use(express.json());

    routerLoader(this.sever);
    const server = this.sever.listen(this.port || 4000);
    require('./healthcheck')(server);
    console.log(`API server is listening on port ${this.port}! :)`);
  }
}

module.exports = new App();
