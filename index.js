const express = require('express');
const bodyParser = require('body-parser');

const Prompt = require('./database').Prompt;

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

app.get('/', (request, response) => {
  response.send('Hello from Express!');
});

app.route('/prompts')
  .get((request, response) => {
    Prompt.find().then((prompts) => {
      console.log(`Found ${prompts.length} prompts`);
      response.send(JSON.stringify(prompts));
    });
  })
  .post((request, response) => {
    Prompt.create(request.body.prompts).then((prompts) => {
      console.log(`Added ${prompts.length} prompt to the database`);
      response.send(JSON.stringify(prompts));
    });
  })
  .delete((request, response) => {
    Prompt.delete(request.query).then((prompt) => {
      response.send(JSON.stringify(prompt));
    });
  });

app.listen(PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${PORT}`);
});
