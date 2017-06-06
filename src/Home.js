import React, {Component} from 'react';
import collector from '@canner/render/lib/client/collectorHoc';

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
          Home Content
        </div>
    );
  }
}
