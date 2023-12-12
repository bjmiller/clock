import { resolve } from 'node:path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin';
import HtmlInlineCssPlugin from 'html-inline-css-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const aggregateTimeout = 200;

const bootConfig: webpack.Configuration = {
  mode: 'production',
  target: 'electron-main',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader']
      }
    ]
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  optimization: {
    minimize: false
  },
  watch: true,
  watchOptions: {
    aggregateTimeout
  }
};

const pageConfig: webpack.Configuration = {
  mode: 'production',
  target: 'electron-renderer',
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src/,
        use: ['ts-loader']
      },
      {
        test: /\.less$/,
        include: /src/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      }
    ]
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      cache: false
    }),
    new HtmlInlineScriptPlugin(),
    new HtmlInlineCssPlugin({ leaveCSSFile: false })
  ],
  watch: true,
  watchOptions: {
    aggregateTimeout
  }
};

export default [bootConfig, pageConfig];
