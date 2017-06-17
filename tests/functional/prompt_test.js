const assert = require('chai').assert;
require('dotenv').config({ path: './../../.promptsrc' });
const request = require('request');

// require('./../../index');

describe('prompt', () => {
  const self = this;

  before(() => {
    self.url = `http://localhost:${process.env.PORT}`;
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


    // curl -X POST http://localhost:3000/prompts -H "Content-Type:application/json" -d '{"text": "Spend five minutes describing an unusual pet"}'
    // describe('POST', () => {
    //   before(() => {
    //     return makeRequest('POST', `${self.url}/prompts`).then(([response, body]) => {
    //       self.response = response;
    //       self.body = JSON.parse(body);
    //     });
    //   });

    //   it('should make a successful request', () => {
    //     assert.equal(200, self.response.statusCode);
    //   });

    //   it('should return an array of prompts', () => {
    //     assert.isArray(self.body);
    //   });

    //   it('should return at least one prompt', () => {
    //     const prompt = self.body[0];
    //     assert.exists(prompt);
    //     assert.exists(prompt._id);
    //     assert.exists(prompt.text);
    //   });
    // });
  });

  // describe('/prompts/:id', () => {
  //   describe('GET', () => {

  //   });

  //   describe('PUT', () => {

  //   });

  //   describe('DELETE', () => {

  //   });
  // });
});
