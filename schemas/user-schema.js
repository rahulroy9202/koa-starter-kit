const utils = require('lib/utils');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  'name': {type: String, default: ''},
  'email': {
    type: String,
    unique: true,
    validate: {validator: utils.isValidEmail, message: 'Please specify a valid email!'}
  },
  'password': {type: String, required: true},
  'is_email_verified': {type: Boolean, default: false},
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

userSchema.set('toJSON', {getters: true, virtuals: true, minimize: false});
userSchema.set('toObject', {getters: true, virtuals: true, minimize: false});

module.exports = mongoose.model('User', userSchema);