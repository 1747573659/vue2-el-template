module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue', 'stylelint-config-prettier'],
  rules: {
    'no-descending-specificity': null,
    'function-url-quotes': 'always',
    'unit-case': null,
    'color-hex-length': 'long',
    'rule-empty-line-before': 'never',
    'font-family-no-missing-generic-family-keyword': null,
    'block-opening-brace-space-before': 'always',
    'unit-no-unknown': [true, { ignoreUnits: ['/rpx/', '/upx/'] }],
    'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['v-deep'] }],
    'at-rule-no-unknown': null,
    'selector-class-pattern': null,
    'scss/double-slash-comment-empty-line-before': 'never',
    'scss/at-import-partial-extension': null
  }
}
