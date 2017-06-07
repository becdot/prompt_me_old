const BaseModel = require('./../database');

const Prompt = {
  name: 'Prompt',

  schemaDefinition: {
    text: String
  }
};

module.exports = Object.assign({}, BaseModel, Prompt);
