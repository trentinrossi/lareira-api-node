const database = require('./database');
const { ObjectID } = require('mongodb');

const OBJECT_ID_PROPS = ['_id'];
const DATE_PROPS = ['createdAt', 'updatedAt'];

class DatabaseManipulator {
  addObjectIdProperties(property) {
    OBJECT_ID_PROPS.push(property);
  }

  addDateProperties(property) {
    DATE_PROPS.push(property);
  }

  setDefaultDatabase(databaseName) {
    database.setDefaultDatabase(databaseName);
  }

  setDefaultClient(clientName, URI) {
    database.setDefaultClient(clientName, URI);
  }

  async connect(clientName, clientURI) {
    await database.connect(clientName, clientURI);
  }

  async getDatabase(databaseName, clientName) {
    return database.createDatabase(databaseName, clientName);
  }

  close() {
    database.close(database.defaultDatabase);
  }

  closeSpecific(clientName) {
    database.close(clientName);
  }

  async execute(configs) {
    const { command } = configs;
    const { collection } = configs;
    const dbName = configs.database
      ? configs.database
      : database.defaultDatabase;
    const dbConnection = configs.client
      ? await this.getDatabase(dbName, configs.client)
      : await this.getDatabase(dbName);
    this.validateCollection(collection);

    switch (command) {
      case 'count':
        return this.countDocuments(dbConnection, collection, configs.query);
      case 'find':
        return this.find(
          dbConnection,
          collection,
          configs.query,
          configs.options
        );
      case 'findOne':
        return this.findOne(
          dbConnection,
          collection,
          configs.query,
          configs.options
        );
      case 'aggregate':
        return this.aggregate(dbConnection, collection, configs.pipeline);
      case 'insert':
        return this.insert(
          dbConnection,
          collection,
          configs.document,
          configs.defaultDelete
        );
      case 'insertMany':
        return this.insertMany(dbConnection, collection, configs.document);
      case 'updateOne':
        return this.updateOne(
          dbConnection,
          collection,
          configs.query,
          configs.document
        );
      case 'findAndModify':
        return this.findAndModify(dbConnection, collection, configs.document);
      case 'update':
        return this.update(
          dbConnection,
          collection,
          configs.query,
          configs.document
        );
      case 'createIndex':
        return this.createIndex(dbConnection, collection, configs.indexes);
      case 'deleteOne':
        return this.deleteOne(dbConnection, collection, configs.query);
      default:
        throw new Error('Invalid command');
    }
  }

  createIndex(dbConnection, collection, indexes) {
    return new Promise((resolve, reject) => {
      dbConnection.collection(collection).createIndex(indexes, (error, doc) => {
        if (error) {
          return reject(error);
        }
        return resolve(doc);
      });
    });
  }

  countDocuments(dbConnection, collection, query = {}) {
    return new Promise((resolve, reject) => {
      dbConnection.collection(collection).count(query, (error, total) => {
        if (error) {
          return reject(error);
        }
        return resolve(total);
      });
    });
  }

  find(
    dbConnection,
    collection,
    query = {},
    options = { skip: 0, sort: {}, projection: { __v: 0 } }
  ) {
    if (options.limit > 0) {
      return new Promise((resolve, reject) => {
        dbConnection
          .collection(collection)
          .find(query, { projection: options.projection })
          .sort(options.sort)
          .skip(options.skip || 0)
          .limit(options.limit)
          .toArray((error, docs) => {
            if (error) {
              return reject(error);
            }
            return resolve(docs);
          });
      });
    }

    return new Promise((resolve, reject) => {
      dbConnection
        .collection(collection)
        .find(query, { projection: options.projection })
        .sort(options.sort)
        .skip(options.skip || 0)
        .toArray((error, docs) => {
          if (error) {
            return reject(error);
          }
          return resolve(docs);
        });
    });
  }

  findOne(dbConnection, collection, query = {}, options = { sort: {} }) {
    const formattedQuery = this.convertToObjectId(query);
    let projection = {};
    if (options.project) {
      projection = { ...options.project };
    } else {
      projection = { __v: 0 };
    }

    return new Promise((resolve, reject) => {
      dbConnection
        .collection(collection)
        .findOne(formattedQuery, { projection }, (error, doc) => {
          if (error) {
            return reject(error);
          }
          return resolve(doc);
        });
    });
  }

  aggregate(dbConnection, collection, pipeline = []) {
    return new Promise((resolve, reject) => {
      dbConnection
        .collection(collection)
        .aggregate(pipeline, { allowDiskUse: true })
        .toArray((error, docs) => {
          if (error) {
            return reject(error);
          }
          return resolve(docs);
        });
    });
  }

  insert(dbConnection, collection, document, defaultDelete = false) {
    const data = this.formatDocument(document);

    if (!data.createdAt) {
      data.createdAt = new Date();
    }

    if (!data.updatedAt) {
      data.updatedAt = new Date();
    }

    data.deleted = defaultDelete;

    return new Promise((resolve, reject) => {
      dbConnection.collection(collection).insertOne(data, (error, doc) => {
        if (error) {
          return reject(error);
        }
        const insertedDocument = this.insertResponseTreatment(doc);
        return resolve(insertedDocument);
      });
    });
  }

  insertMany(dbConnection, collection, documents) {
    let data = documents;

    if (!(data instanceof Array)) {
      data = [data];
    }

    data = this.formatDocument(data);
    data = data.map((document) => {
      const item = document;

      if (!item.createdAt) {
        item.createdAt = new Date();
      }

      if (!item.updatedAt) {
        item.updatedAt = new Date();
      }

      item.deleted = false;

      return item;
    });

    return new Promise((resolve, reject) => {
      dbConnection.collection(collection).insertMany(data, (error, doc) => {
        if (error) {
          return reject(error);
        }
        const insertedDocument = this.insertResponseTreatment(doc);
        return resolve(insertedDocument);
      });
    });
  }

  updateOne(dbConnection, collection, query = {}, document) {
    let data = document;

    if (data._id) {
      delete data._id;
    }

    data = this.formatDocument(data);
    data.updatedAt = new Date();

    const formattedQuery = this.formatDocument(query);

    return new Promise((resolve, reject) => {
      dbConnection
        .collection(collection)
        .updateOne(formattedQuery, { $set: document }, (error, doc) => {
          if (error) {
            return reject(error);
          }
          return resolve(doc);
        });
    });
  }

  findAndModify(dbConnection, collection, document, query = {}) {
    const data = this.formatDocument(document);
    const formattedQuery = this.formatDocument(query);
    return new Promise((resolve, reject) => {
      dbConnection
        .collection(collection)
        .findAndModify(formattedQuery, data, (error, doc) => {
          if (error) {
            return reject(error);
          }
          return resolve(doc);
        });
    });
  }

  update(dbConnection, collection, query = {}, document) {
    const data = this.formatDocument(document);
    const formattedQuery = this.formatDocument(query);
    return new Promise((resolve, reject) => {
      dbConnection
        .collection(collection)
        .update(formattedQuery, data, (error, doc) => {
          if (error) {
            return reject(error);
          }
          return resolve(doc);
        });
    });
  }

  deleteOne(dbConnection, collection, query = {}) {
    const formattedQuery = this.formatDocument(query);

    return new Promise((resolve, reject) => {
      dbConnection
        .collection(collection)
        .deleteOne(formattedQuery, (error, doc) => {
          if (error) {
            return reject(error);
          }
          return resolve(doc);
        });
    });
  }

  toObjectId(propertie) {
    if (!propertie) {
      throw new Error('Propertie id not provided!');
    }

    return new ObjectID(propertie);
  }

  test(dbConnection, collection) {
    return new Promise((resolve, reject) => {
      dbConnection.collection(collection).countDocuments({}, (error, docs) => {
        if (error) return reject(error);
        return resolve(docs);
      });
    });
  }

  validateCollection(collection) {
    if (!collection) {
      throw new Error('Invalid collection!');
    }
  }

  formatDocument(document) {
    if (document instanceof Array) {
      const data = document.map((doc) => {
        let item = doc;
        item = this.convertToDate(item);
        item = this.convertToObjectId(item);
        return item;
      });
      return data;
    }

    let data = document;
    data = this.convertToDate(document);
    data = this.convertToObjectId(document);
    return data;
  }

  convertToObjectId(document = {}) {
    const data = document;

    Object.keys(data).forEach((key) => {
      if (OBJECT_ID_PROPS.includes(key) && typeof data[key] === 'string') {
        data[key] = new ObjectID(data[key]);
      }
    });
    return data;
  }

  convertToDate(document = {}) {
    const data = document;
    Object.keys(data).forEach((key) => {
      if (DATE_PROPS.includes(key)) {
        data[key] = new Date(data[key]);
      }
    });
    return data;
  }

  insertResponseTreatment(document) {
    if (document.insertedCount === 0) {
      return [];
    }

    if (document.ops.length === 0) {
      return [];
    }

    const [createdDocument] = document.ops;
    return createdDocument;
  }
}

module.exports = new DatabaseManipulator();
