const React = require('react');
const ReactDOMServer = require('react-dom/server');

const App = require('./app.jsx');

module.exports = ReactDOMServer.renderToString(<App />);
