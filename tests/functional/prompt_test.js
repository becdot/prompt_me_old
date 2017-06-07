const assert = require('chai').assert;
const request = require('request');

require('./../../index');

describe('prompt', () => {
  const self = this;

  before(() => {
    self.port = process.env.PORT;
    self.url = `http://localhost:${self.port}`;
  });

  const makeRequest = (method, uri) => {
    return new Promise((resolve, reject) => {
      return request({ method, uri }, (err, resp, body) => {
        if (err) {
          reject(err);
        } else {
          resolve([resp, body]);
        }
      });
    });
  };

  describe('/prompts', () => {
    describe('GET', () => {
      before(() => {
        return makeRequest('GET', `${self.url}/prompts`).then(([response, body]) => {
          self.response = response;
          self.body = JSON.parse(body);
        });
      });

      it('should make a successful request', () => {
        assert.equal(200, self.response.statusCode);
      });

      it('should return an array of prompts', () => {
        assert.isArray(self.body);
      });

      it('should return at least one prompt', () => {
        const prompt = self.body[0];
        assert.exists(prompt);
        assert.exists(prompt._id);
        assert.exists(prompt.text);
      });
    });
  });
});
