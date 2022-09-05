/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const buildPath = path.resolve(__dirname, '../dist');

const baseConfig = {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    filename: 'index.js',
    path: buildPath,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]__[local]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.tsx?$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif|m4a|mp3|aac|ogg|wav)$/i,
        loader: 'file-loader',
        generator: {
          filename: 'images/[hash][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin(),
  ],
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode
    ? {
      mode: 'production',
      plugins: [
        new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: [
            buildPath,
          ],
          dry: false,
          dangerouslyAllowCleanPatternsOutsideProject: true,
        }),
      ],
    }
    : {
      mode: 'development',
      devtool: 'inline-source-map',
    };

  const merged = merge(baseConfig, envConfig);
  return merged;
};
