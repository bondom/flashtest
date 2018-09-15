const path = require('path');
const webpack = require('webpack');

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const styleLoaderOptions = {
  modules: true,
  // 12hag1 - it is hardcoded hash, needed to produce the same localIdentName across builds
  localIdentName: '[name]-[local]-12hag1',
  camelCase: true,
  sourceMap: true,
  namedExport: true
};

module.exports = {
  entry: path.join(__dirname, '.'),
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        enforce: 'pre', // will be executed before ts-loader below
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'typings-for-css-modules-loader',
            options: styleLoaderOptions
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'App title',
      template: path.join(__dirname, 'index.html'),
      inject: 'body',
      hash: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // Perform type checking and linting in a separate process to speed up compilation
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.join(__dirname, '../', 'tsconfig.json'),
      tslint: undefined,
      async: false
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, './'),
    port: 8001,
    compress: false,
    hot: true,
    stats: 'errors-only',
    open: false,
    clientLogLevel: 'none',
    historyApiFallback: {
      disableDotRule: true
    }
  }
};
