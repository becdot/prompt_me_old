module.exports = {
    "extends": "airbnb",
    "globals": {
      "describe": false,
      "it": false,
      "beforeEach": false,
      "afterEach": false,
      "before": false,
      "after": false,
      "document": false
    },
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
      "comma-dangle": 0,
      "consistent-return": 0,
      "react/jsx-filename-extension": 0,
      "no-underscore-dangle": 0
    }
};
