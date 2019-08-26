const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const SRC_DIR = path.join(__dirname, '/src');
const DIST_DIR = path.join(__dirname, '/dist');
module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx)$/,
        include: SRC_DIR,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-react', '@babel/preset-env'],
        },
      },
      { test: /\.css$/, loader: 'style-loader' },
      {
        test: /\.css$/,
        include: SRC_DIR,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            passes: 5,
          },
          safari10: true,
          mangle: {
            ie8: true, 
          },
          ecma: 6,
          output: {
            comments: false,
          }
        },
      }),
    ],
  },
  devServer: {
    contentBase: DIST_DIR,
    hot: true,
    port: 9000,
    historyApiFallback: true
  },
};