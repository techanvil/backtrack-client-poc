module.exports = function override(config) {
  const {module: {rules}} = config;

  rules[rules.length - 1].oneOf.unshift({
    test: /\.schema\.json$/,
    type: 'javascript/auto',
    exclude: /node_modules/,
    loader: require.resolve('@cloudflare/json-schema-ref-loader')
  });

  return config;
}
