const path = require('path');
const { parsed: localEnv } = require('dotenv').config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });
const webpack = require('webpack');

console.log({ env: process.env.NODE_ENV });
console.log({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

module.exports = {
  webpack: (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    return config;
  },
  reactStrictMode: true
};