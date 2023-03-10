const services = require('../services/createUser');
const httpError = require('../utils/httpError');
const bcrypt = require('bcrypt');


const createUser = async (req, res) => {
  try {
    const credentials = req.body.data;
    const hashedPassword = bcrypt.hashSync(credentials.password, 10);
    credentials.password = hashedPassword;
    console.log("CRED", credentials)
    const result = await services.saveCredentialsToDb(credentials);
    res.status(201).json({ message: result });
  } catch (error) {
    if (error instanceof httpError) {
      res.status(200).json({ message: error.message });
      // res.status(error.code).json({message: error.message});
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const validateUser = async (req, res) => {
  try {
    const credentials = req.body;
    const token = await services.checkUser(credentials);

    res.status(201).json({ message: 'logged in successfully', token: token });
  } catch (error) {
    if (error instanceof httpError) {
      res.status(error.code).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};


const authenticate = async (req, res) => {
  try {
    const credentials = req.body;
    await services.validate(credentials, req);
    res.status(201).json({ message: 'logged in successfully' });
  } catch (error) {
    if (error instanceof httpError) {
      res.status(error.code).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { createUser, validateUser, authenticate };