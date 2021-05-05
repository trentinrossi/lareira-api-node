const manager = require('./database-manager');

class Database {
  setDefaultDatabase(name) {
    console.log(`Setting default database: ${name}`);
    this.defaultDatabase = name;
  }

  setDefaultClient(name, URI) {
    this.defaultClientName = name;
    this.defaultClientURI = URI;
  }

  async connect(client = this.defaultClientName, URI = this.defaultClientURI) {
    // console.log(client);
    console.log(this.defaultClientName);
    console.log(this.defaultClientURI);
    if (!client || !URI) {
      throw new Error('Client name or URI not identified');
    }

    if (!this[client]) {
      this[client] = {};
    }

    this[client].conn = await manager.connect({ parametrization: client, URI });

    if (!this[client].conn) {
      throw new Error('Client is not connected');
    }

    this[client].dbs = {};
    return true;
  }

  async createDatabase(
    databaseName = this.defaultDatabase,
    clientName = this.defaultClientName
  ) {
    if (!this[clientName].conn) {
      throw new Error('Connect at your client');
    }

    if (this[clientName].dbs[databaseName]) {
      return this[clientName].dbs[databaseName];
    }

    try {
      const database = await manager.getDB(
        { parametrization: clientName },
        databaseName
      );
      this[clientName].dbs[databaseName] = database;
      return database;
    } catch (err) {
      this[clientName].dbs[databaseName] = null;
      return null;
    }
  }

  close(clientName) {
    if (this[clientName]) {
      delete this[clientName];
    }
  }
}

module.exports = new Database();
