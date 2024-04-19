import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      include: ['src', '!src/**/__tests__/**'],
    },
  },
});
