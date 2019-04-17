var webpackMerge = require('webpack-merge');
var commonConfig = require('./common.config');

module.exports = webpackMerge(commonConfig, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.*css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
});