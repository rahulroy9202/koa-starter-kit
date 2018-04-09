const debug = require('debug')('core:controller:user');
const uuid = require('uuid');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const {ValidationError} = require('lib/errors');
const {generateJWTforUser} = require('lib/utils');

module.exports = {

  async get(ctx) {
    const user = ctx.state.user;
    user.token = generateJWTforUser(_.pick(user, ['_id', 'role'])).token;
    ctx.body = {user: _.omit(user, ['password'])};
  },

  async post(ctx) {
    const {body} = ctx.request;
    let {user = {}} = body;
    user.password = await bcrypt.hash(user.password, 10);
    user = new ctx.app.models.User(user);
    await user.save();
    ctx.body = {user: _.omit(user.toObject(), ['password'])};
  },

  async login(ctx) {
    const {body} = ctx.request;
    if (!_.isObject(body.user) || !body.user.email || !body.user.password) {
      ctx.throw(422, new ValidationError('email or password is invalid'));
    }

    let user = await ctx.app.models.User.findOne({email: body.user.email});
    if (!user) {
      return ctx.throw(422, new ValidationError('email or password is invalid'));
    }

    user = user.toObject();

    const isValid = await bcrypt.compare(body.user.password, user.password);
    if (!isValid) {
      ctx.throw(422, new ValidationError('email or password is invalid'));
    }

    user.token = generateJWTforUser(_.pick(user, ['_id', 'role'])).token;
    ctx.body = {user: _.omit(user, ['password'])};
  }

};