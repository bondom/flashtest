const path = require('path');
const webpack = require('webpack');

/**
 * This config is being used to build production build of library.
 * The main cause of using webpack config instead of tsc is possibility to pass env variable.
 */
module.exports = {
  entry: path.join(__dirname, 'index.ts'),
  output: {
    path: path.resolve(__dirname, '..', 'build'),
    filename: 'index.js',
    library: '',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [{ test: /\.(ts|js)x?$/, loader: 'ts-loader' }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        OFF_CONSOLE: true
      }
    })
  ]
};
