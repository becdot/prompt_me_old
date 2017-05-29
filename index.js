const express = require('express');
const bodyParser = require('body-parser');

const Prompt = require('./database').Prompt;

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

const onError = (response, error) => {
  console.log(error);
  response.send(JSON.stringify(`There was an error with your request: ${error}`));
};

app.get('/', (request, response) => {
  response.send('Hello from Express!');
});

app.route('/prompts')
  .get((request, response) => {
    Prompt.find().then((prompts) => {
      console.log(`Found ${prompts.length} prompts`);
      response.send(JSON.stringify(prompts));
    }).catch(onError.bind(this, response));
  })
  .post((request, response) => {
    Prompt.create(request.body).then((prompt) => {
      console.log(`Added prompt ${prompt.id} to the database`);
      response.send(JSON.stringify(prompt));
    }).catch(onError.bind(this, response));
  });
app.route('/prompts/:id')
  .get((request, response) => {
    Prompt.find({ _id: request.params.id }).then((prompt) => {
      console.log(`Found prompt ${prompt}`);
      response.send(JSON.stringify(prompt));
    }).catch(onError.bind(this, response));
  })
  .put((request, response) => {
    Prompt.update(request.params.id, request.body).then((prompt) => {
      console.log(`Updated prompt ${prompt}`);
      response.send(JSON.stringify(prompt));
    }).catch(onError.bind(this, response));
  })
  .delete((request, response) => {
    Prompt.delete({ _id: request.params.id }).then((prompt) => {
      console.log(`Deleted prompt ${prompt}`);
      response.send(JSON.stringify(prompt));
    }).catch(onError.bind(this, response));
  });

app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
