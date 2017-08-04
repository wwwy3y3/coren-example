import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import Home from './Home';
import UserList from './UserList';
import User from './User';
import {collector} from 'coren';

@collector()
export default class Root extends Component {
  static defineHead() {
    return {
      title: "home",
      description: "home description"
    };
  }

  static defineRoutes({Url}) {
    return new Url('/');
  }

  render() {
    return (
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/users">All Users</Link></li>
          </ul>

          <hr/>
          <Route exact path="/" component={Home}/>
          <Route exact path="/users" component={UserList}/>
          <Route exact path="/users/:id" component={User}/>
        </div>
    );
  }
}
