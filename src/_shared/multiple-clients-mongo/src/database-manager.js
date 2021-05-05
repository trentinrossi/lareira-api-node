const { MongoClient } = require('mongodb');

class DatabaseManager {
  static async connect(client, force = false) {
    if (this[client.parametrization] === null) {
      throw new Error('Database is not connected!');
    }

    if (this[client.parametrization] && !force) {
      return this[client.parametrization];
    }

    try {
      const connection = await MongoClient.connect(client.URI, {
        socketTimeoutMS: 900000,
      });

      this[client.parametrization] = connection;
      return true;
    } catch (err) {
      this[client.parametrization] = null;
      return null;
    }
  }

  static async getDB(client, name) {
    try {
      if (
        !this[client.parametrization] ||
        this[client.parametrization] === null
      ) {
        this[client.parametrization] = this.connect(client);
      }

      if (!this[client.parametrization] === null) {
        throw new Error('Database can not be connected!');
      }

      const server = this[client.parametrization];
      const database = await server.db(name);

      return database;
    } catch (err) {
      return null;
    }
  }

  static close(client) {
    if (this[client.parametrization]) {
      this[client.parametrization].close();
      delete this[client.parametrization];
    }
  }
}

module.exports = DatabaseManager;
