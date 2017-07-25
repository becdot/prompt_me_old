const assert = require('chai').assert;
const request = require('request');
require('dotenv').config({ path: './.promptsrc' });

const Prompt = require('./../../prompt/prompt');

describe('prompt', () => {
  const self = this;

  before(() => {
    self.url = `http://localhost:${process.env.PORT}`;
    self.ids = [];
    const promptData = [{ text: 'Prompt 1.' }, { text: 'Prompt 2.' }];
    const model = Prompt.getModel();
    return Prompt.connect().
      then(() => model.create(promptData)).
      then(prompts => prompts.forEach(p => self.ids.push(p._id))).
      then(Prompt.close);
  });

  after(() => {
    const model = Prompt.getModel();
    return Prompt.connect().then(() => model.remove({})).then(Prompt.close);
  });

  const makeRequest = (options) => {
    return new Promise((resolve, reject) => {
      request(options, (err, resp, body) => {
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
        const data = { method: 'GET', uri: `${self.url}/prompts` };
        return makeRequest(data).then(([response, body]) => {
          self.response = response;
          self.body = JSON.parse(body);
        });
      });

      it('should make a successful request', () => {
        assert.equal(200, self.response.statusCode);
      });

      it('should return a non-empty array of prompts', () => {
        assert.isArray(self.body);
        assert.notEmpty(self.body);
      });
    });

    describe('POST', () => {
      before(() => {
        const data = { method: 'POST', uri: `${self.url}/prompts`, json: true, body: { text: 'A prompt.' } };
        return makeRequest(data).then(([response, body]) => {
          self.response = response;
          self.body = body;
        });
      });

      it('should make a successful request', () => {
        assert.equal(200, self.response.statusCode);
      });

      it('should return the ID of the new prompt', () => {
        assert.ok(self.body._id);
      });
    });
  });

  describe('/prompts/:id', () => {
    describe('GET', () => {
      before(() => {
        const data = { method: 'GET', uri: `${self.url}/prompts/${self.ids[0]}` };
        return makeRequest(data).then(([response, body]) => {
          self.response = response;
          self.body = JSON.parse(body);
        });
      });

      it('should make a successful request', () => {
        assert.equal(200, self.response.statusCode);
      });

      it('should return the correct prompt', () => {
        assert.equal(self.ids[0], self.body._id);
        assert.equal('Prompt 1.', self.body.text);
      });
    });

    describe('PUT', () => {
      before(() => {
        const data = { method: 'PUT', uri: `${self.url}/prompts/${self.ids[0]}`, json: true, body: { text: 'A way cooler prompt!' } };
        return makeRequest(data).then(([response, body]) => {
          self.response = response;
          self.body = body;
        });
      });

      it('should make a successful request', () => {
        assert.equal(200, self.response.statusCode);
      });

      it('should return the old prompt text', () => {
        assert.equal(self.ids[0], self.body._id);
        assert.equal('Prompt 1.', self.body.text);
      });

      it('should be able to query for the new text', () => {
        return Prompt.find({ _id: self.body._id }).then((prompt) => {
          assert.equal('A way cooler prompt!', prompt.text);
        });
      });
    });

    describe('DELETE', () => {
      before(() => {
        const data = { method: 'DELETE', uri: `${self.url}/prompts/${self.ids[0]}` };

        return new Promise(resolve => {
          makeRequest(data).then(([response, body]) => {
            self.response = response;
            self.body = JSON.parse(body);
            resolve();
          });
        });
      });

      it('should make a successful request', () => {
        assert.equal(200, self.response.statusCode);
      });

      it('should return the deleted prompt text', () => {
        assert.equal(self.ids[0], self.body._id);
      });

      it('should not be able to find the deleted model', () => {
        return Prompt.find({ _id: self.ids[0] }).then(prompt => {
          assert.notOk(prompt);
        });
      });
    });
  });
});
