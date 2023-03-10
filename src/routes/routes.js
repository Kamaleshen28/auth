const express = require('express');
const router = express.Router();
const controllers = require('../controllers/createUser');

router.post('/user', controllers.createUser);
router.post('/login', controllers.validateUser);
router.post('/validate/token', controllers.authenticate);

module.exports = router;