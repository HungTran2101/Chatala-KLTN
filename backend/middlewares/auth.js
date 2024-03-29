const Users = require('../models/userModel');
const { decodeJWT } = require('../utils/utilFunctions');
const ErrorHandler = require('../utils/errorHandler');

module.exports = async (req, res, next) => {
  const { token } = req.signedCookies;

  if (!token) {
    return next(new ErrorHandler('Unauthorized!', 401));
  }

  const isDecoded = decodeJWT(token);

  req.user = await Users.findById(isDecoded.id);

  if (!req.user) {
    return next(new ErrorHandler('Unauthorized!', 401));
  }

  next();
};
