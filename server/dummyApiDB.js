const Datastore = require('nedb');
const db = new Datastore();
const bluebird = require('bluebird');
const Cursor = db.find().constructor;
bluebird.promisifyAll(Datastore.prototype);
bluebird.promisifyAll(Cursor.prototype);

const rp = require('request-promise');

module.exports = function getDB() {
  return rp('http://jsonplaceholder.typicode.com/users')
  .then(json => {
    return db.insertAsync(JSON.parse(json));
  })
  .then(() => db);
};
