// jest.transform.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const babelJest = require('babel-jest');

export default babelJest.default.createTransformer({
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
});