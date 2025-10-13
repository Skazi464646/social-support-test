import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
vi.stubEnv('VITE_OPENAI_API_KEY', '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');
vi.stubEnv('VITE_AI_ENABLED', 'true');

// Global test utilities and mocks will be added here as needed