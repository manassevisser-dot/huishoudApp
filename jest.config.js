
/**
 * PHOENIX JEST CONFIG (Sanitized v1.0)
 * ADR-12 Audit-ready
 */
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],

  /* @aliases-start */
moduleNameMapper: {
    '^\@domain/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/domain/$1',
    '^\@state/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/state/$1',
    '^\@ui/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/ui/$1',
    '^\@styles/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/ui/styles/$1',
    '^\@app/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/app/$1',
    '^\@utils/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/utils/$1',
    '^\@services/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/services/$1',
    '^\@assets/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/_assets/$1',
    '^\@logic/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/logic/$1',
    '^\@config/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/config/$1',
    '^\@context/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/app/context/$1',
    '^\@selectors/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/selectors/$1',
    '^\@shared-types/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/shared-types/$1',
    '^\@components/(.*),
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
: '<rootDir>/src/ui/components/$1',
  },
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
