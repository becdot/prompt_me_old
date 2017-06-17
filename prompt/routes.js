const Prompt = require('./prompt');
const routes = require('./../routes');

const express = require('express');

const router = express.Router();

router.route('/prompts')
  .get((request, response) => {
    Prompt.findAll().then((prompts) => {
      console.log(`Found ${prompts.length} prompts`);
      response.send(JSON.stringify(prompts));
    }).catch(routes.onError.bind(this, response));
  })
  .post((request, response) => {
    Prompt.create(request.body).then((prompt) => {
      console.log(`Added prompt ${prompt.id} to the database`);
      response.send(JSON.stringify(prompt));
    }).catch(routes.onError.bind(this, response));
  });

router.route('/prompts/:id')
  .get((request, response) => {
    Prompt.find({ _id: request.params.id }).then((prompt) => {
      console.log(`Found prompt ${prompt}`);
      response.send(JSON.stringify(prompt));
    }).catch(routes.onError.bind(this, response));
  })
  .put((request, response) => {
    Prompt.update({ _id: request.params.id }, request.body).then((prompt) => {
      console.log(`Updated prompt ${prompt}`);
      response.send(JSON.stringify(prompt));
    }).catch(routes.onError.bind(this, response));
  })
  .delete((request, response) => {
    Prompt.delete({ _id: request.params.id }).then((prompt) => {
      console.log(`Deleted prompt ${prompt}`);
      response.send(JSON.stringify(prompt));
    }).catch(routes.onError.bind(this, response));
  });

module.exports = router;
