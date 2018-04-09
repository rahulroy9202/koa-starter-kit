const {jwtSecret, jwtOptions} = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const utils = {

  generateJWTforUser: function generateJWTforUser(user = {}) {
    return Object.assign({}, user, {
      token: jwt.sign({
        sub: _.pick(user, ['_id', 'email', 'username'])
      }, jwtSecret, jwtOptions)
    })
  },

  isValidEmail: function (email) {
    let re_email = new RegExp(
      '^[a-z0-9\u007F-\uffff!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$', 'i');
    return re_email.exec(email);
  }

};

module.exports = utils;