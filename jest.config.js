module.exports = {
  preset: 'react-native', // Gebruik de basis RN preset ipv Expo om 'Winter' te omzeilen
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^\@domain/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/src/domain/$1',
    '^\@state/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/src/state/$1',
    '^\@ui/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/src/ui/$1',
    '^\@app/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/src/app/$1',
    '^\@utils/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/src/utils/$1',
    '^\@services/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/src/services/$1',
    '^\@assets/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/assets/$1',
    '^\@logic/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/src/logic/$1',
    '^\@context/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/src/context/$1',
    '^\@selectors/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/src/selectors/$1',
    '^\@shared-types/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/src/types/$1',
    '^\@components/(.*),
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
: '<rootDir>/src/components/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
