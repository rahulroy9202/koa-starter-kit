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
const insertDataCount = 0;
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

async function executeTests(distance = 1000) {
  await printDataCount();
  performance.mark('executeTestsStart');
  let d = {
    name: faker.name.findName(),
    location: {type: "Point", coordinates: [faker.address.longitude(), faker.address.latitude()]}
  };
  // debug('find near:', d);
  // debug('distance:', distance);

  let res = await Cargo.find({
    location: {
      $near: {
        // $geometry: {type: "Point", coordinates: [-109.2049, 77.8002]},
        $geometry: d.location,
        $maxDistance: distance    // in meters
      }
    }
  });

  performance.mark('executeTestsEnd');
  performance.measure('executeTests', 'executeTestsStart', 'executeTestsEnd');
  let measure = _.last(performance.getEntriesByName('executeTests'));
  debug(`Found ${res.length} Docs / Distance ${distance} / Location ${d.location.coordinates} - Time: ${measure.duration}`);
  // debug('executeTests DONE!!!', res);
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
  debug('Data Count: ', await Cargo.countDocuments({}));
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
    for (let i = 0; i < 3; i++) {
      await insertMultipleData();
      await insertData();
    }
  }
  if (runTests)
    for (let i = 0; i < 10; i++) {
      await executeTests(i * 100 *  1000)
    }
  process.exit();
});