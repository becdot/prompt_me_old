const express = require('express');
const bodyParser = require('body-parser');

const Database = require('./database');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

app.get('/', (request, response) => {
  response.send('Hello from Express!');
});

app.route('/prompts')
  .get((request, response) => {
    Database.find('prompts').then((prompts) => {
      console.log(`Found ${prompts.length} prompts`);
      response.send(JSON.stringify(prompts));
    });
  })
  .post((request, response) => {
    Database.add('prompts', request.body.prompts).then((prompts) => {
      console.log(`Added ${prompts.result.n} prompt to the database`);
      response.send(JSON.stringify(prompts.ops));
    });
  })
  .delete((request, response) => {
    Database.delete('prompts', request.body.prompts).then((prompts) => {
      console.log(`Deleted ${prompts.result.n} prompts from the database`);
      response.send(JSON.stringify(prompts.ops));
    });
  });

app.listen(PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${PORT}`);
});
