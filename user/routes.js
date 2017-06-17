const User = require('./user');
const routes = require('./../routes');

const express = require('express');

const router = express.Router();

router.route('/users')
  .get((request, response) => {
    User.findAll().then((users) => {
      console.log(`Found ${users.length} users`);
      response.send(JSON.stringify(users));
    }).catch(routes.onError.bind(this, response));
  })
  .post((request, response) => {
    User.create(request.body).then((user) => {
      console.log(`Added user ${user.id} to the database`);
      response.send(JSON.stringify(user));
    }).catch(routes.onError.bind(this, response));
  });

router.route('/users/:username')
  .get((request, response) => {
    User.find({ username: request.params.username }).then((user) => {
      console.log(`Found user ${user}`);
      response.send(JSON.stringify(user));
    }).catch(routes.onError.bind(this, response));
  })
  .put((request, response) => {
    User.update({ username: request.params.username }, request.body).then((user) => {
      console.log(`Updated user ${user}`);
      response.send(JSON.stringify(user));
    }).catch(routes.onError.bind(this, response));
  })
  .delete((request, response) => {
    User.delete({ username: request.params.username }).then((user) => {
      console.log(`Deleted user ${user}`);
      response.send(JSON.stringify(user));
    }).catch(routes.onError.bind(this, response));
  });

module.exports = router;
