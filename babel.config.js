module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true
      }],
      // FI9_NAYEK v13 PHASE 8: Plugin Reanimated requis pour animations
      'react-native-reanimated/plugin'
    ]
  };
};
