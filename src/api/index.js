const userController = require('../helper/user');
const express = require('express');
const router = new express.Router();

router.get('/user', userController.getUsers);
router.get('/user/:address', userController.getUser);
router.post('/user', userController.addUser);
router.delete('/user', userController.removeUser);

module.exports = router;
