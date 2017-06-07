# render-example
此範例展示如何使用 render 處理 常見情況 React SPA 的 serverside render，最後 build 到 local filesystem，用 `serve` 展示

使用 react-router v4 的網站，使用 SSR 加強SEO 或是 build html 到 cdn 上都適用 

## modules used
* react-router v4
* redux
* redux-api-middleware

## 此範例如何使用 collector
* routesCollector 產生需要 ssr 的 url
``` js
// /src/Home
static defineRoutes({Url}) {
  return new Url('/');
}
```

``` js
// /src/User
// server 會執行 db.users.find().execAsync() 取得資料後對照 '/users/:id'
// 產生多個 url
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

* headCollector 處理 title, description
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
User component 使用 defineHead 使用 component construct 時拿到的props，拿到從 react-router route 傳下來的 match 參數，並放在title跟description中

* immutable redux collector
由於在 reducer 中，我們常用 immutable 作為 state，所以 render 在 html 中，需要用immutable在包起來，傳到reducer中才不會出錯
``` js
class ImmutableReduxCollector extends ReduxCollector {
  appendToHead($head) {
    $head.append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/immutable/3.8.1/immutable.min.js"></script>`);
    // render __PRELOADED_STATE__ 時，用Immutable.fromJS包起來
    $head.append(`<script>
      window.__PRELOADED_STATE__ = Immutable.fromJS(${JSON.stringify(this.state ? this.state.toJS() : {})})
      </script>`);
  }

  wrapApp(appElement) {
    // 如果 透過 collector 搜集回來的 initialState 是空的，則傳 undefined 到 store中 ，讓 store 產生 initialState
    const store = createStore(this.reducers, isEmpty(this.initialState) ? undefined : immutable.fromJS(this.initialState));
    const wrapedElements = react.createElement(Provider, {store}, appElement);
    this.state = store.getState();
    return wrapedElements;
  }
}
```
component中使用 definePreloadedState 回傳自己使用的 initialState
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

## Usage
```js
$ npm run serve
$ open localhost:5000
view source to see the html built
```

## dev server
```
node devServer.js
```
