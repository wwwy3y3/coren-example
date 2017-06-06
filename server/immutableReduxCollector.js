const {createStore} = require('redux');
const {Provider} = require('react-redux');
const react = require('react');
const immutable = require('immutable');
const {ReduxCollector} = require('@canner/render');
const {isEmpty} = require('lodash');

class ImmutableReduxCollector extends ReduxCollector {
  appendToHead($head) {
    $head.append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/immutable/3.8.1/immutable.min.js"></script>`);
    $head.append(`<script>
      window.__PRELOADED_STATE__ = Immutable.fromJS(${JSON.stringify(this.finalState ? this.finalState.toJS() : {})})
      </script>`);
  }

  wrapApp(appElement) {
    const store = createStore(this.reducers, isEmpty(this.states) ? undefined : immutable.fromJS(this.states));
    const wrapedElements = react.createElement(Provider, {store}, appElement);
    this.finalState = store.getState();
    return wrapedElements;
  }
}

module.exports = ImmutableReduxCollector;
