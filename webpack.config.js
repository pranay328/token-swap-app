const path = require('path');

/**
 * Webpack configuration for the token swap app.
 *
 * This configuration defines the entry point, output
 * bundle, development server, and loaders for JavaScript and CSS.
 * It is intentionally simple so that anyone cloning the repository
 * can run `npm install` followed by `npm start` to boot the app
 * locally. All React and API code lives under the `src` directory.
 */
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};