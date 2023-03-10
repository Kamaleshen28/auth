const { credentials } = require('../../database/models');
const httpError = require('../utils/httpError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const saveCredentialsToDb = async (cred) => {
  console.log("1.", cred)
  const existingUser = await credentials.findAll({
    where: { email: cred.email }
  });
  console.log("2.", existingUser)

  if (existingUser.length != 0) {
    throw new httpError('user alredy exist', 403);
  }
  const user = await credentials.create(cred);
  console.log("HERE")
  return user;
};

const checkUser = async (cred) => {
  const payload = {
    email: cred.data.email
  };
  const existingUser = await credentials.findOne({
    where: { email: cred.data.email }
  });
  if (!existingUser) {
    throw new httpError('Invalid Credentials', 401);
  }
  const match = await bcrypt.compare(cred.data.password, existingUser.dataValues.password);
  if (!match) {
    throw new httpError('Invalid Credentials', 401);
  }
  const token = jwt.sign(
    payload,
    'secret',
    {
      expiresIn: '2h',
    });
  // eslint-disable-next-line no-undef
  await redisClient.set(token, 'true');
  return token;
};

const validate = async (cred, req) => {

  const tokenGiven = req.header('token');
  const decoded = jwt.verify(tokenGiven, 'secret');
  const currentUser = await credentials.findOne({ where: { email: decoded.email } });

  if (!currentUser.dataValues.email) {
    throw new httpError('User not found', 1000);
  }
  // eslint-disable-next-line no-undef
  const tokenSavedInRedis = await redisClient.get(tokenGiven);
  console.log('GETTING TOKEN', tokenSavedInRedis);
  if (!tokenSavedInRedis) {
    throw new httpError('Invalid TOKEN', 401);
  }
  console.log('ALL GOOD: ', tokenSavedInRedis, tokenGiven);
};

module.exports = { saveCredentialsToDb, checkUser, validate };