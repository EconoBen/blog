/**
 * CRACO configuration file for customizing Create React App webpack config
 */
const webpack = require('webpack');
const PostGeneratorPlugin = require('./scripts/PostGeneratorPlugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add loader for markdown files
      webpackConfig.module.rules.push({
        test: /\.md$/,
        type: 'asset/source', // This will load the file as a string
      });

      // Add buffer fallback (preserving existing configuration)
      if (!webpackConfig.resolve) {
        webpackConfig.resolve = {};
      }
      if (!webpackConfig.resolve.fallback) {
        webpackConfig.resolve.fallback = {};
      }
      webpackConfig.resolve.fallback.buffer = require.resolve('buffer/');

      // Add Buffer plugin (preserving existing configuration)
      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        // Add our custom plugin to auto-generate PostService.ts
        new PostGeneratorPlugin()
      );

      return webpackConfig;
    },
  },
};
