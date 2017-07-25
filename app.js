const React = require('react');

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Prompt Me</h1>
        <h2>{"Today's prompt is"}</h2>
      </div>
    );
  }
}

module.exports = App;
