const resolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');

const production = process.env.BUILD === 'production';

module.exports = {
  input: 'js/index.js',
  output: {
    file: 'dist/aura-bundle.js',
    format: 'iife',
    name: 'AURA',
    sourcemap: !production
  },
  plugins: [
    resolve(),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};