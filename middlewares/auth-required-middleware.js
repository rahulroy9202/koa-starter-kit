const debug = require('debug')('core:middleware:auth-required');
const {UnauthorizedError} = require('lib/errors');

module.exports = function (ctx, next) {
  if (!ctx.state.user) {
    ctx.throw(401, new UnauthorizedError());
  }
  return next()
};