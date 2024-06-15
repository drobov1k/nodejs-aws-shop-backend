module.exports = {
  setupFiles: ['<rootDir>/jest/setEnvVars.js'],
  roots: ['<rootDir>'],
  projects: ['<rootDir>/services'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  workerIdleMemoryLimit: '1GB',
  collectCoverage: true,
  verbose: true,
};
