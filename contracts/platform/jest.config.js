module.exports = {
    roots: [
      '<rootDir>/__tests__',
    ],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '__tests__\\/.*',
    moduleFileExtensions: [
      'ts',
      'js',
      'json',
      'node',
      'd.ts',
    ],
    setupFilesAfterEnv: [],
    testEnvironment: 'node',
};