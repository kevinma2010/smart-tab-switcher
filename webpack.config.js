const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  const browser = env.browser || 'chrome';
  const manifestFile = `src/manifest.${browser}.json`;

  return {
    entry: {
      popup: './src/popup/popup.tsx',
      background: './src/background/background.ts',
    },
    output: {
      path: path.resolve(__dirname, `dist/${browser}`),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: manifestFile,
            to: 'manifest.json',
            transform(content) {
              return Buffer.from(
                JSON.stringify({
                  ...JSON.parse(content.toString()),
                  version: process.env.npm_package_version,
                })
              );
            },
          },
          {
            from: 'src/popup/popup.html',
            to: 'popup.html',
          },
          {
            from: 'src/icons',
            to: 'icons',
          },
        ],
      }),
    ],
    devtool: 'source-map',
    optimization: {
      minimize: false,
    },
  };
};
