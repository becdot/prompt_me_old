const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const DB_URL = 'mongodb://localhost:27017/prompt_me';

const BaseModel = {
  connect() {
    return new Promise((resolve, reject) => {
      return mongoose.connect(DB_URL, (error) => {
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
  }
};

const Prompt = {
  create(data) {
    const Model = Prompt.getModel();
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
    const Model = Prompt.getModel();
    return (
      this.connect()
      .then(() => Model.find(criteria))
      .then(this.close)
      .catch(this.onError)
    );
  },

  update(id = null, data = {}) {
    const Model = Prompt.getModel();
    if (!id) {
      return Promise.reject(new Error('You must specify an id to update'));
    } else if (Object.keys(data).length === 0) {
      return Promise.reject(new Error('You must specify PUT data to update'));
    }
    return (
      this.connect()
      .then(() => Model.findOneAndUpdate({ _id: id }, data))
      .then(this.close)
      .catch(this.onError)
    );
  },

  delete(criteria = {}) {
    const Model = Prompt.getModel();
    if (Object.keys(criteria).length === 0) {
      return Promise.reject(new Error('You must specify DELETE criteria'));
    }
    return (
      this.connect()
      .then(() => Model.findOneAndRemove(criteria))
      .then(this.close)
      .catch(this.onError)
    );
  },

  name: 'Prompt',

  schemaDefinition: {
    text: String
  },

  getSchema: () => {
    if (!Prompt._schema) {
      Prompt._schema = new mongoose.Schema(Prompt.schemaDefinition);
    }
    return Prompt._schema;
  },

  getModel: () => {
    if (!Prompt._model) {
      Prompt._model = mongoose.model(Prompt.name, Prompt.getSchema());
    }
    return Prompt._model;
  }
};

module.exports = {
  Prompt: Object.assign({}, BaseModel, Prompt)
};
