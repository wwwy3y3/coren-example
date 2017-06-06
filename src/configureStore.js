import {createStore, applyMiddleware, compose} from 'redux';
import {apiMiddleware} from 'redux-api-middleware';
import {createLogger} from 'redux-logger'
import reducer from './reducer';

const createStoreWithMiddleware = compose(
  applyMiddleware(apiMiddleware),
  applyMiddleware(createLogger())
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
