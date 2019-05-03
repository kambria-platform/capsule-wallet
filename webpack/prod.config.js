var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./common.config');
var TerserPlugin = require('terser-webpack-plugin');

module.exports = webpackMerge(commonConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.*css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin()
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false
    })
  ]
});