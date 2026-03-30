import { resolve } from 'node:path';
import type webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin';
import HtmlInlineCssPlugin from 'html-inline-css-webpack-plugin/build/core/v4.js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import Dotenv from 'dotenv-webpack';

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
    path: resolve('dist'),
    filename: 'index.js'
  },
  optimization: {
    minimize: false
  },
  plugins: [new Dotenv()],
  watch: true,
  watchOptions: {
    aggregateTimeout
  }
};

const pageConfig: webpack.Configuration = {
  mode: 'production',
  target: 'electron-renderer',
  entry: './src/main.ts',
  externalsPresets: { node: false },
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
      },
      {
        test: /\.svg$/,
        type: 'asset/inline'
      }
    ]
  },
  resolve: {
    alias: {
      rollbar$: resolve('node_modules/rollbar/dist/rollbar.umd.js')
    },
    extensions: ['', '.ts', '.js', '.svg', '...']
  },
  output: {
    path: resolve('dist'),
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
    new HtmlInlineCssPlugin.PluginForHtmlWebpackPluginV4({ leaveCSSFile: false }),
    new Dotenv()
  ],
  watch: true,
  watchOptions: {
    aggregateTimeout
  }
};

export default [bootConfig, pageConfig];
