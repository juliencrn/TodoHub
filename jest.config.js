/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  moduleNameMapper: {
    '^~/app/(.*)$': '<rootDir>/src/app/$1',
    '^~/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^~/infra/(.*)$': '<rootDir>/src/infra/$1',
    '^~/shared/(.*)$': '<rootDir>/src/shared/$1',
  },
}
