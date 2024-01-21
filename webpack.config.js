const CopyPlugin = require('copy-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode:'development',
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: 'babel-loader'
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
          filename: 'static/css/[name].css'
      }),
      new CopyPlugin({
          patterns: [
              { from: 'public/assets', to: 'assets' },
          ]
      }),
    ]
  };