import { Logger } from '@nestjs/common';

// Disable logging during tests
Logger.overrideLogger(['error', 'warn']);

// Global test timeout
jest.setTimeout(10000);

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}; 