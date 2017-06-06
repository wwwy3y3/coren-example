import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchUser} from './actions';
import collector from '@canner/render/lib/client/collectorHoc';

@collector()
@connect(mapStateToProps, mapDispatchToProps)
export default class UserList extends Component {
  static propTypes = {
    fetchUser: PropTypes.func,
    userId: PropTypes.string,
    user: PropTypes.object
  };

  static defineHead() {
    return {
      title: "user",
      description: "user"
    };
  }

  static defineRoutes({ParamUrl, db}) {
    return new ParamUrl({
      url: '/users/:id',
      dataProvider: () => db.find().execAsync()
    });
  }

  componentDidMount() {
    const {fetchUser, userId} = this.props;
    fetchUser(userId);
  }

  render() {
    const {user} = this.props;
    if (user.get('fetched') && user.get('error')) {
      return <div>Error</div>;
    }

    if (user.get('isFetching')) {
      return <div>loading</div>;
    }

    return (
        <div>
          {user.get('data').get('name')}
        </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    userId: ownProps.match.params.id,
    user: state.get('currentUser')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: userId => dispatch(fetchUser(userId))
  };
}
