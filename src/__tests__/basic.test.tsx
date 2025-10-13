import { describe, it, expect } from 'vitest';

describe('Basic Test Setup', () => {
  it('should work with basic assertions', () => {
    expect(1 + 1).toBe(2);
  });

  it('should work with string assertions', () => {
    expect('hello world').toContain('world');
  });
});