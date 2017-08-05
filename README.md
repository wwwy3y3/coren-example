# Coren-example
This example repo shows how to serverside render React Single Page App with `coren`

# Usage
``` sh
$ git clone git@github.com:Canner/coren-example.git
$ yarn
$ npm run coren
$ node app.js
$ open http://localhost:9393
view source to see HTML
```

## modules used
* react-router v4
* redux
* redux-api-middleware

## How this example use Coren
* use `RoutesCollector` to generate routes need to be rendered
``` js
// /src/Home
static defineRoutes({Url}) {
  return new Url('/');
}
```

``` js
// /src/User
// server will execute db.users.find().execAsync(), get the data then generate multiple routes with path '/users/:id'
static defineRoutes({ParamUrl, db}) {
  return new ParamUrl({
    url: '/users/:id',
    dataProvider: () => db.users.find().execAsync()
  });
}
```

``` js
// /src/UserList
static defineRoutes({Url}) {
  return new Url('/users');
}
```

* use `HeadCollector` to get title, description
``` js
// /src/User
static defineHead(props) {
  const userId = props.match.params.id;
  return {
    title: `user ${userId}`,
    description: `user ${userId}`
  };
}
```

* customized `ImmutableReduxCollector`
as a best practice in our team, we use immutable state in redux. so we modify some part of ReduxCollector
``` js
class ImmutableReduxCollector extends ReduxCollector {
  appendToHead($head) {
    $head.append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/immutable/3.8.1/immutable.min.js"></script>`);
    // wrap state with Immutable, when rendered in HTML
    $head.append(`<script>
      window.__PRELOADED_STATE__ = Immutable.fromJS(${JSON.stringify(this.state ? this.state.toJS() : {})})
      </script>`);
  }

  wrapApp(appElement) {
    // if initialState collected from components is empty, we pass undefined to store , let store.getState() be the intial state in reducer 
    const store = createStore(this.reducers, isEmpty(this.initialState) ? undefined : immutable.fromJS(this.initialState));
    const wrapedElements = react.createElement(Provider, {store}, appElement);
    this.state = store.getState();
    return wrapedElements;
  }
}
```

in Component, we use `definePreloadedState` return initialState this component need
``` js
// /src/UserList
// 透過 server 傳過來的 db 做出 query
static definePreloadedState({db}) {
  return db.users.find().execAsync()
  .then(list => ({
    users: {
      list,
      fetched: true,
      isFetching: false,
      error: false
    }
  }));
}
```

## dev server
```
node devServer.js
```
