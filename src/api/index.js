const userController = require('../helper/user');
const express = require('express');
const router = new express.Router();
const { authen } = require('../helper/middleware')

router.get('/user', authen, userController.getUsers);
router.get('/user/:address',authen, userController.getUser);
router.post('/user', authen, userController.addUser);
router.delete('/user', authen, userController.removeUser);

module.exports = router;
