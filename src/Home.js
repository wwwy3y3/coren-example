import React, {Component} from 'react';
import {ssr, head, route, reactRouterRedux} from 'coren';
import reducer from './reducer';
import './home.css';

@reactRouterRedux({reducer})
@route('/')
@head({title: 'home', description: 'home description'})
@ssr
export default class Root extends Component {
  render() {
    return (
      <div className="home">
        Home Content
      </div>
    );
  }
}
