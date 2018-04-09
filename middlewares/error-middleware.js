const debug = require('debug')('core:middleware:error');
const errors = require('lib/errors');
const _ = require('lodash');
const http = require('http');

let constants = {HTTP: {}};
Object.entries(http.STATUS_CODES).forEach(([key, value]) => {
  constants.HTTP[key] = value.toUpperCase().replace(/\s/igm, '_');
});

module.exports = async (ctx, next) => {
  try {
    await next();
    if (Number(ctx.response.status) === 404 && !ctx.response.body) {
      ctx.throw(404)
    }
  } catch (err) {
    ctx.type = 'application/json';

    if (!ctx.response.body) {
      ctx.response.body = {errors: {}}
    }
    // ctx.app.emit('error', err, ctx);
    console.error(err);

    switch (true) {
      case err instanceof errors.ValidationError:
        // ctx.body.errors = formatValidationError(err);
        ctx.status = _.defaultTo(err.status, 422);
        break;

      case Number(err.code) === 11000: { // Mongo DUP UNIQUE
        ctx.body.errors = err.message;
        ctx.status = _.defaultTo(err.status, 422);
        break
      }

      default:
        ctx.status = _.defaultTo(err.status, 500);
        break
    }
  } finally {
    if (ctx.body && !ctx.body.code) {
      ctx.body.code = constants.HTTP[String(ctx.status)]
    }
  }
};

// function formatValidationError (err) {
//   const result = {};
//   if (err.path) {
//     result[err.path] = [_.defaultTo(err.message, 'is not valid')];
//   }
//   if (err.inner && err.inner.length > 0) {
//     err.inner
//       .map(err => formatValidationError(err))
//       .reduce((prev, curr) => (Object.assign(prev, curr)), result);
//   }
//   return result
// }
