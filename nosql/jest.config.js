/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {

   bail: 1,
  verbose: true,
  clearMocks: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],
  preset: '@shelf/jest-mongodb',
  testMatch: ['**/tests/**/*.test.ts'],

};