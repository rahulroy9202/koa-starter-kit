const debug = require('debug')('core:middleware:jwt');
const koaJwt = require('koa-jwt');
const config = require('config');

module.exports = koaJwt({
  getToken (ctx, opts) {
    const {authorization} = ctx.header;
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      console.log(authorization.split(' ')[1]);
      return authorization.split(' ')[1];
    }
    return null;
  },
  secret: config.jwtSecret,
  passthrough: true,
  key: 'jwt'
});
