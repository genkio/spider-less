module.exports = {
  extends: 'standard',
  plugins: [
    'standard',
    'promise'
  ],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    'no-useless-constructor': 0,
    'no-extra-bind': 1,
    'handle-callback-err': 1,
    'prefer-promise-reject-errors': 1,
    'space-before-function-paren': 0
  }
}
