require("babel-polyfill");

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
  entry: ["babel-polyfill", path.resolve(__dirname, '../main.js')],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../'),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        enforce: 'pre',
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'url-loader'
      },
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin()
    ],
  },
  resolve: {
    alias: {
      Style: path.resolve(__dirname, '../wallet/skin/static/style/')
    }
  },
  node: {
    fs: 'empty'
  }
};