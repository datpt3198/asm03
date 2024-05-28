const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require("../models/user");

const verifyToken = promisify(jwt.verify);

const isAuth = allowedRole => {
  return (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(' ')[1];

    verifyToken(token, 'somesupersecretsecret')
      .then(decodedToken => {
        return User.findById(decodedToken.userId);
      })
      .then(user => {
        if (!user) {
          return next();
        }
        req.user = user;
        return user.role;
      })
      .then(userRole => {
        if (allowedRole.includes(userRole)) {
          next();
        } else {
          const error = new Error('Not allowed.');
          error.statusCode = 401;
          throw error;
        }
      })
      .catch(err => {
        if (err.name === 'JsonWebTokenError') {
          err.statusCode = 401;
        }
        next(err);
      });
  };
};

module.exports = isAuth;