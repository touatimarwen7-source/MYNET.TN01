/**
 * Jest Configuration for MyNet.tn Backend
 */

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'services/**/*.js',
    'middleware/**/*.js',
    'controllers/**/*.js',
    '!**/*.js.snap'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  testTimeout: 10000,
  verbose: true,
  forceExit: true,
  bail: false,
  maxWorkers: '50%'
};
