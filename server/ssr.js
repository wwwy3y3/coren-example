const path = require('path');
const getDB = require('./dummyApiDB');
const {
  CollectorManager,
  MultiRoutesRenderer,
  HeadCollector,
  RoutesCollector
} = require('@canner/render');
const ImmutableReduxCollector = require('./immutableReduxCollector');
const reducer = require('../lib/reducer');

getDB().then(db => {
  const collectorManager = new CollectorManager({
    appPath: path.resolve(__dirname, '../lib')
  });
  collectorManager.registerCollector("head", new HeadCollector());
  collectorManager.registerCollector("routes", new RoutesCollector({
    componentProps: {
      db
    }
  }));
  collectorManager.registerCollector("redux", new ImmutableReduxCollector({
    componentProps: {
      db
    },
    reducers: reducer
  }));
  const ssr = new MultiRoutesRenderer({collectorManager});
  ssr.renderToString()
  .then(str => console.log(str))
  .catch(err => console.log(err));
});
