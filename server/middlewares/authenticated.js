'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');

const secret = 'secret_key_course_develop_angular_social_network';

// Method to authenticate the token
exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({message: 'The request does not have the authentication header'});
  }

  // Clean the quotation token
  let token = req.headers.authorization.replace(/['"]+/g, '');
  const payload = jwt.decode(token, secret);

  try {
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({message: 'The token has expired'});
    }
  } catch (ex) {
    return res.status(404).send({message: 'Invalid token'});
  }

  req.user = payload;

  next();
};