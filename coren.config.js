const getDB = require('./server/dummyApiDB');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});

module.exports = {
  entry: {
    index: './src/index.js',
    $vendor: ['react', 'react-dom', 'react-router']
  },
  ssrWebpack: {
    plugins: [
      extractCSS
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: extractCSS.extract(["css-loader?minimize"])
        }
      ]
    }
  },
  assetsHost: (env, absolutePath = '') => {
    const rel = path.relative(`${__dirname}/dist/`, absolutePath);
    switch (env) {
      case 'production':
        return `https://s3-ap-northeast-1.amazonaws.com/static.canner.io/coren-example/dist/${rel}`;
      case 'development':
      case 'pre-production':
        return `http://localhost:5556/dist/${rel}`;
      default:
        return false;
    }
  },
  prepareContext: function() {
    return getDB().then(db => ({db}));
  }
};
