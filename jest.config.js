// jest.config.js
/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }]
        ],
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm/)?(react|react-dom|scheduler|@testing-library|@babel|react-icons)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Different test configs for client and server
  projects: [
    // Server tests configuration
    {
      displayName: 'server',
      testMatch: ['<rootDir>/server/**/*.test.ts'],
      testEnvironment: 'node',
      moduleNameMapper: {
        '^@shared/(.*)$': '<rootDir>/shared/$1',
        '^@server/(.*)$': '<rootDir>/server/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.server.ts'],
      transform: {
        '^.+\\.(ts|js)$': [
          'babel-jest',
          {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              '@babel/preset-typescript'
            ],
          },
        ],
      },
    },
    // Client tests configuration
    {
      displayName: 'client',
      testMatch: ['<rootDir>/client/src/**/*.test.{ts,tsx}'],
      testEnvironment: 'jsdom',
      moduleNameMapper: {
        // Handle CSS imports (if you use CSS in your React components)
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        // Handle module aliases
        '^@/(.*)$': '<rootDir>/client/src/$1',
        '^@shared/(.*)$': '<rootDir>/shared/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.client.js'],
      transform: {
        '^.+\\.(ts|tsx|js|jsx)$': [
          'babel-jest',
          {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              '@babel/preset-typescript',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
          },
        ],
      },
      transformIgnorePatterns: [
        '/node_modules/(?!(.pnpm/)?(react|react-dom|scheduler|@testing-library|@babel|react-icons)/)'
      ],
    },
  ],
  // Coverage configuration
  collectCoverageFrom: [
    'client/src/**/*.{ts,tsx}',
    'server/**/*.ts',
    'shared/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
};

export default config;