const bodyParser = require('body-parser');
require('dotenv').config({ path: './.promptsrc' });
const express = require('express');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

// const promptRoutes = require('./prompt/routes');
const Prompt = require('./prompt/prompt');
const User = require('./user/user');

const app = express();
app.use(bodyParser.json());

app.use(session({
  store: new RedisStore({
    url: process.env.REDIS_STORE_URI
  }),
  secret: process.env.REDIS_STORE_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const onError = (response, error) => {
  console.log(error);
  response.send(JSON.stringify(`There was an error with your request: ${error}`));
};

app.get('/', (request, response) => {
  response.send('Hello from Express!');
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log(`looking for user ${username}...`);
    User
    .find({ username, password })
    .then(user => done(null, user));
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.find({ _id: id }).then((err, user) => done(err, user));
});

app.post('/login', passport.authenticate('local'), (req, res) => res.redirect(`/users/${req.user.username}`));

app.route('/prompts')
  .get((request, response) => {
    Prompt.findAll().then((prompts) => {
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
    Prompt.update({ _id: request.params.id }, request.body).then((prompt) => {
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

app.route('/users')
  .get((request, response) => {
    User.findAll().then((users) => {
      console.log(`Found ${users.length} users`);
      response.send(JSON.stringify(users));
    }).catch(onError.bind(this, response));
  })
  .post((request, response) => {
    User.create(request.body).then((user) => {
      console.log(`Added user ${user.id} to the database`);
      response.send(JSON.stringify(user));
    }).catch(onError.bind(this, response));
  });
app.route('/users/:username')
//   .get((request, response) => {
//     User.find({ username: request.params.username }).then((user) => {
//       console.log(`Found user ${user}`);
//       response.send(JSON.stringify(user));
//     }).catch(onError.bind(this, response));
//   })
//   .put((request, response) => {
//     User.update({ username: request.params.username }, request.body).then((user) => {
//       console.log(`Updated user ${user}`);
//       response.send(JSON.stringify(user));
//     }).catch(onError.bind(this, response));
//   })
//   .delete((request, response) => {
//     User.delete({ username: request.params.username }).then((user) => {
//       console.log(`Deleted user ${user}`);
//       response.send(JSON.stringify(user));
//     }).catch(onError.bind(this, response));
//   });

// app.use('/prompts', promptRoutes);

app.listen(process.env.PORT, () => console.log(`server is listening on ${process.env.PORT}`));
