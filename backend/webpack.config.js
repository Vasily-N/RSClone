const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: {
    app: [
      './index.ts',
      './src/registration/router.ts',
      './src/registration/user.ts',
      './src/registration/userController.ts',
      './src/registration/userService.ts',
      './src/authentication/routerAuth.ts',
      './src/authentication/authController.ts',
      './src/authentication/authService.ts',
      './src/lead-borders/routerBorder.ts',
      './src/lead-borders/borders.ts',
      './src/lead-borders/borderController.ts',
      './src/lead-borders/borderService.ts',
    ],
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
