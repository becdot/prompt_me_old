const MongoClient = require('mongodb').MongoClient;

const DB_URL = 'mongodb://localhost:27017/myproject';

const Database = {
  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(DB_URL, (err, db) => {
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      });
    });
  },

  _close(db, result) {
    return new Promise((resolve) => {
      console.log('db closed');
      db.close();
      console.log('resolving with result');
      resolve(result);
    });
  },

  _add(collection, data) {
    console.log(`called _add with data ${data}`);
    return new Promise((resolve, reject) => {
      collection.insertMany(data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(`Inserted ${data.length} items into collection`);
          resolve(result);
        }
      });
    });
  },

  _find(collection, criteria = {}) {
    return new Promise((resolve, reject) => {
      collection.find(criteria).toArray((err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(`Found ${result.length} matching results`);
          resolve(result);
        }
      });
    });
  },

  _delete(collection, criteria = {}) {
    return new Promise((resolve, reject) => {
      collection.deleteOne(criteria, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(`Deleted ${result.length} matching results`);
          resolve(result);
        }
      });
    });
  },

  add(collectionName, data) {
    return Database.wrapper(db => Database._add(db.collection(collectionName), data));
  },

  find(collectionName, criteria = {}) {
    return Database.wrapper(db => Database._find(db.collection(collectionName), criteria));
  },

  delete(collectionName, criteria = {}) {
    return Database.wrapper(db => Database._delete(db.collection(collectionName), criteria));
  },

  wrapper(method) {
    return Database.connect().then((db) => {
      const close = Database._close.bind(this, db);
      return method(db).then(close);
    });
  }
};

module.exports = Database;
