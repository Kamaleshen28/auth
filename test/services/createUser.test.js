const controllers = require('../../src/controllers/createUser');
const services = require('../../src/services/createUser');
const bcrypt = require('bcrypt');
const { credentials } = require('../../database/models');

const httpError = require('../../src/utils/httpError');


describe('services', () => {
  describe('saveCredentialsToDb', async () => {
    it('should', async () => {
      const cred = {
        email: ''
      };
      jest.spyOn(credentials, 'findAll').mockResolvedValue(['kamal']);
      jest.spyOn(credentials, 'create').mockResolvedValue('success');
      // expect(await services.saveCredentialsToDb()).toEqual('');

    });
  });
});