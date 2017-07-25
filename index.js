const bodyParser = require('body-parser');
require('dotenv').config({ path: './.promptsrc' });
const express = require('express');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const session = require('express-session');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const RedisStore = require('connect-redis')(session);

// const promptRoutes = require('./prompt/routes');
const App = require('./app.js');
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

const renderFullPage = (html, preloadedState) => {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Prompt Me</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
};

const handleRender = (response) => {
  // Create a new Redux store instance
  const store = createStore(App);
  // Render the component to a string
  const html = ReactDOMServer.renderToString(<App />);
  // Grab the initial state from our Redux store
  const preloadedState = store.getState();
  // Send the rendered page back to the client
  response.send(renderFullPage(html, preloadedState));
};

app.get('/', (request, response) => {
  return handleRender(response);
});

passport.deserializeUser((id, done) => {
  User.find({ _id: id }).then((err, user) => done(err, user));
});

app.post('/api/login', passport.authenticate('local'), (req, res) => res.redirect(`/users/${req.user.username}`));

app.route('/api/prompts')
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
app.route('/api/prompts/:id')
  .get((request, response) => {
    Prompt.find({ _id: request.params.id }).then((prompt) => {
      console.log(`Found prompt ${prompt}`);
      response.send(JSON.stringify(prompt));
    }).catch(onError.bind(this, response));
  })
  .put((request, response) => {
    console.log(request.params, request.body);
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

app.route('/api/users')
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
app.route('/api/users/:username');

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
