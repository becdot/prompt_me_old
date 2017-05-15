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
  }
};

const Prompt = {
  create(data) {
    const Model = Prompt.getModel();
    return this.connect().then(() => {
      return Promise.all(data.map((json) => {
        const prompt = new Model(json);
        return prompt.save();
      }));
    }).then(this.close);
  },

  find(criteria = {}) {
    const Model = Prompt.getModel();
    return this.connect().then(() => Model.find(criteria)).then(this.close);
  },

  delete(criteria = {}) {
    const Model = Prompt.getModel();
    if (Object.keys(criteria).length === 0) {
      throw new Error('You must specify delete criteria');
    }
    return this.connect().then(() => Model.findOneAndRemove(criteria)).then(this.close);
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
