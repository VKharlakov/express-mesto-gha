module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-base',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
  ],
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};
