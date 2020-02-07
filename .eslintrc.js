module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
  },
  'extends': [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {},
};