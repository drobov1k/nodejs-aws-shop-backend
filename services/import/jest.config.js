const { compilerOptions } = require('./tsconfig');
const { pathsToModuleNameMapper } = require('ts-jest');

process.env.S3_BUCKET_NAME = 'importstack-mybucketf68f3ff0-sn6vevzba9vr';
process.env.AWS_REGION = 'eu-central-1';

module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
};
