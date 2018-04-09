const debug = require('debug')('core:middleware:db');
const config = require('config');
const mongoose = require('mongoose');
const schemas = require('schemas/index');

module.exports = function (app) {

  mongoose.Promise = global.Promise;
  mongoose.connection.on('error', function (err) {
    debug('Connection to database failed! : ' + err);
    process.exit(-1);
  });
  
  mongoose.connect(config.db, {
    keepAlive: true,
    reconnectTries: 100
  });

  app.db = mongoose;
  app.models = mongoose.models;

  return async function (ctx, next) {

    return next()
  }
};