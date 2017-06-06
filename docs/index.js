import React from 'react';
import ReactDOM from 'react-dom';
import {apiMiddleware} from 'redux-api-middleware';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import reducer from '../src/reducer';
import App from '../src';
import configureStore from '../src/configureStore';

const store = configureStore();

ReactDOM.render(
  <div>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </div>
, document.getElementById('root'));
