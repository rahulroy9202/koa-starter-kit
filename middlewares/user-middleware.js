const debug = require('debug')('core:middleware:user');
const {has} = require('lodash');

module.exports = async (ctx, next) => {
  if (has(ctx, 'state.jwt.sub._id')) {
    ctx.state.user = (await ctx.app.models.User.findOne({_id: ctx.state.jwt.sub._id})).toObject();
    debug(ctx.state.user);
  }
  return next();
};
