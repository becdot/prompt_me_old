const mongoose = require('mongoose');

const config = require('./config');

mongoose.Promise = global.Promise;

const BaseModel = {
  connect() {
    return new Promise((resolve, reject) => {
      return mongoose.connect(config.db.url, (error) => {
        if (error) {
          reject(error);
        }
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
          resolve();
        });
      });
    });
  },

  close(result) {
    return new Promise((resolve, reject) => {
      return mongoose.connection.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  },

  onError(err) {
    BaseModel.close();
    return Promise.reject(err);
  },

  getSchema() {
    if (!this._schema) {
      this._schema = new mongoose.Schema(this.schemaDefinition);
    }
    return this._schema;
  },

  getModel() {
    if (!this._model) {
      this._model = mongoose.model(this.name, this.getSchema());
    }
    return this._model;
  },

  create(data) {
    const Model = this.getModel();
    return (
      this.connect()
      .then(() => {
        const prompt = new Model(data);
        return prompt.save();
      })
      .then(this.close)
      .catch(this.onError)
    );
  },

  find(criteria = {}) {
    const Model = this.getModel();
    return (
      this.connect()
      .then(() => Model.findOne(criteria))
      .then(this.close)
      .catch(this.onError)
    );
  },

  findAll(criteria = {}) {
    const Model = this.getModel();
    return (
      this.connect()
      .then(() => Model.find(criteria))
      .then(this.close)
      .catch(this.onError)
    );
  },

  update(criteria, data = {}) {
    const Model = this.getModel();
    if (Object.keys(data).length === 0) {
      return Promise.reject(new Error('You must specify criteria'));
    } else if (Object.keys(data).length === 0) {
      return Promise.reject(new Error('You must specify PUT data to update'));
    }
    return (
      this.connect()
      .then(() => Model.findOneAndUpdate(criteria, data))
      .then(this.close)
      .catch(this.onError)
    );
  },

  delete(criteria = {}) {
    const Model = this.getModel();
    if (Object.keys(criteria).length === 0) {
      return Promise.reject(new Error('You must specify DELETE criteria'));
    }
    return (
      this.connect()
      .then(() => Model.findOneAndRemove(criteria))
      .then(this.close)
      .catch(this.onError)
    );
  }
};

module.exports = BaseModel;
