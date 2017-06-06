import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchAllUsers} from './actions';
import {Link} from 'react-router-dom';
import collector from '@canner/render/lib/client/collectorHoc';

@collector()
@connect(mapStateToProps, mapDispatchToProps)
export default class UserList extends Component {
  static propTypes = {
    fetchAllUsers: PropTypes.func,
    users: PropTypes.object
  };

  static defineHead() {
    return {
      title: "user list",
      description: "user list"
    };
  }

  static defineRoutes({Url}) {
    return new Url({
      url: '/users'
    });
  }

  componentDidMount() {
    this.props.fetchAllUsers();
  }

  render() {
    const {users} = this.props;
    if (users.get('fetched') && users.get('error')) {
      return <div>Error</div>;
    }

    if (users.get('isFetching')) {
      return <div>loading</div>;
    }

    return (
        <div>
          <ul>
          {
            users.get('list').toJS().map(user =>
              <li><Link to={`/users/${user.id}`}>{user.id} {user.name}</Link></li>
            )
          }
          </ul>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.get('users')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllUsers: () => dispatch(fetchAllUsers())
  };
}
