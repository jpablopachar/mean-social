const jwt = require('jwt-simple');
const moment = require('moment');

const secret = 'secret_key_course_develop_angular_social_network';

// Method to create a token
exports.createToken = (user) => {
  const payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    nickname: user.nickname,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(), // Date of creation of the token
    exp: moment().add(30, 'days').unix, // Token expiration date
  };

  return jwt.encode(payload, secret);
};
