const controllers = require('../../src/controllers/createUser');
const services = require('../../src/services/createUser');
const bcrypt = require('bcrypt');

const httpError = require('../../src/utils/httpError');


describe('controllers', () => {
  describe('createUser', () => {
    it('should work properly when input is correct', async () => {
      jest.spyOn(bcrypt, 'hashSync').mockResolvedValue('kjdhgfuyehw');
      // const mockCredentials = {
      //   userName: '',
      //   password: kjdhgfuyehw
      // };
      jest.spyOn(services, 'saveCredentialsToDb').mockResolvedValue('Created');
      const mockReq = {
        body: {
          data: {}
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await controllers.createUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockRes.json).toBeCalledWith({ message: 'Created' });
    });

    it('should throw 200 error when the user already exists ', async () => {
      jest.spyOn(bcrypt, 'hashSync').mockResolvedValue('kjdhgfuyehw');
      jest.spyOn(services, 'saveCredentialsToDb').mockRejectedValue(new httpError('user alredy exist', 200));
      const mockReq = {
        body: {
          data: {
            email: '',
            password: ''
          }
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await controllers.createUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith({ message: 'user alredy exist' });
    });
    it('should throw 500 error when the req.body does not contain proper data ', async () => {
      jest.spyOn(bcrypt, 'hashSync').mockResolvedValue('kjdhgfuyehw');
      jest.spyOn(services, 'saveCredentialsToDb').mockResolvedValue('Created');
      const mockReq = {
        body: {
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await controllers.createUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockRes.json).toBeCalledWith({ message: 'Cannot read properties of undefined (reading \'password\')' });
    });

  });

  describe('validateUser', () => {
    it('should store send logged in successfully when credentials are correct', async () => {
      jest.spyOn(services, 'checkUser').mockResolvedValue('kjdhgfuyehw');
      const mockReq = {
        body: {
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await controllers.validateUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockRes.json).toBeCalledWith({ message: 'logged in successfully', token: 'kjdhgfuyehw' });
    });
    it('should throw 401 error when credentials are incorrect', async () => {
      jest.spyOn(services, 'checkUser').mockRejectedValue(new httpError('Invalid Credentials', 401));
      const mockReq = {
        body: {
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await controllers.validateUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(401);
      expect(mockRes.json).toBeCalledWith({ message: 'Invalid Credentials' });
    });
    it('should throw 500 error when something wrong with database', async () => {
      jest.spyOn(services, 'checkUser').mockRejectedValue(new Error('something went wrong', 500));
      const mockReq = {
        body: {
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await controllers.validateUser(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockRes.json).toBeCalledWith({ message: 'something went wrong' });
    });
  });

  describe('authenticate', () => {
    it('should say logged in succesfully when the token is correct', async () => {
      jest.spyOn(services, 'validate').mockResolvedValue();
      const mockReq = {
        body: {
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await controllers.authenticate(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockRes.json).toBeCalledWith({ message: 'logged in successfully' });
    });

    it('should throw httpError when token is invalid', async () => {
      jest.spyOn(services, 'validate').mockRejectedValue(new httpError('User not found', 404));
      const mockReq = {
        body: {
        },
        header: {
          token: ''
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await controllers.authenticate(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(404);
      expect(mockRes.json).toBeCalledWith({ message: 'User not found' });
    });
    it('should throw internal 500 error when something wrong with db', async () => {
      jest.spyOn(services, 'validate').mockRejectedValue(new Error('something went wrong', 500));
      const mockReq = {
        body: {
        },
        header: {
          token: ''
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await controllers.authenticate(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockRes.json).toBeCalledWith({ message: 'something went wrong' });
    });

  });


});