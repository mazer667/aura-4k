const resolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const terser = require('@rollup/plugin-terser');

const production = process.env.BUILD === 'production';

module.exports = {
  input: 'js/aura.ts',
  output: {
    file: 'dist/aura-bundle.js',
    format: 'iife',
    name: 'AURA',
    sourcemap: !production
  },
  plugins: [
    typescript(),
    resolve(),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};