const debug = require('debug')('scripts:faker');
const {PerformanceObserver, performance} = require('perf_hooks');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('./config');
const faker = require('faker');
const _ = require('lodash');
// faker.locale = "en_IND";
// faker.seed(80);
// flags
const insertDataCount = 1000;
const runTests = true;

const obs = new PerformanceObserver((list, observer) => {
  observer.disconnect()
});
obs.observe({entryTypes: ['mark', 'measure'], buffered: true});

const cargoSchema = new Schema({
  name: {type: String},
  location: {type: {type: String, enum: ['Point'], required: true}, coordinates: {type: [Number], required: true}}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});
let Cargo = mongoose.model('Cargo', cargoSchema);

mongoose.Promise = global.Promise;
mongoose.connection.on('error', function (err) {
  debug('Connection to database failed! : ' + err);
  process.exit(-1);
});

async function executeTests() {
  await printDataCount();
  performance.mark('executeTests');
  let d = {
    name: faker.name.findName(),
    location: {type: "Point", coordinates: [faker.address.longitude(), faker.address.latitude()]}
  };
  debug('find near:', d);

  debug('executeTests DONE!!!');
}

async function insertData() {
  await printDataCount();
  performance.mark('insertStart');
  let d = {
    name: faker.name.findName(),
    location: {type: "Point", coordinates: [faker.address.longitude(), faker.address.latitude()]}
  };
  await new Cargo(d).save();
  debug('INSERT one DATA DONE!!!');
  performance.mark('insertEnd');
  performance.measure('insert', 'insertStart', 'insertEnd');
  let measure = _.last(performance.getEntriesByName('insert'));
  debug(`Insert 1 Doc - Time: ${measure.duration}`);
}

async function printDataCount() {
  debug('Data Count: ', await Cargo.count({}));
}

async function insertMultipleData() {
  await printDataCount();
  performance.mark('insertMultiStart');
  let data = [];
  for (let i = 0; i < insertDataCount; i++) {
    data.push(new Cargo({
      name: faker.name.findName(),
      location: {type: "Point", coordinates: [faker.address.longitude(), faker.address.latitude()]}
    }));
  }
  await Cargo.insertMany(data);
  debug('INSERT CARGO DATA DONE!!!', insertDataCount);
  performance.mark('insertMultiEnd');
  performance.measure('insertMulti', 'insertMultiStart', 'insertMultiEnd');
  let measure = _.last(performance.getEntriesByName('insertMulti'));
  debug(`Insert ${insertDataCount} Docs - Time:  ${measure.duration}`);
}

mongoose.connect(config.db, {keepAlive: true, reconnectTries: 100}, async (err, db) => {
  debug('DB CONNECTED');
  if (insertDataCount) {
    for (let i = 0; i < 10; i++) {
      await insertMultipleData();
      await insertData();
    }
  }
  if (runTests)
    await executeTests();
  process.exit();
});