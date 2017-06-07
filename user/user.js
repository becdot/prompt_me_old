const BaseModel = require('./../database');

const User = {
  name: 'User',

  schemaDefinition: {
    username: String,
    password: String
  }
};

module.exports = Object.assign({}, BaseModel, User);
