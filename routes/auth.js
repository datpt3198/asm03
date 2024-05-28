const express = require('express');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/users', isAuth(['Admin']), authController.getAllData);

router.post('/users/signup', authController.postSignUp);

router.post('/users/login/', authController.postLogin);

router.get(
  '/users/:userId',
  isAuth(['Admin', 'Customer']),
  authController.getDetailData
);

module.exports = router;