import { defineConfig } from '@pandacss/dev';
import { pluginResponsiveVariants } from 'panda-plugin-crv';
import { pluginComponentTokens } from 'panda-plugin-ct';

export default defineConfig({
  preflight: true,
  include: ['./{src,pages,app}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      breakpoints: {
        verybig: '2000px',
      },
    },
  },
  outdir: 'styled-system',
  logLevel: 'debug',
  clean: true,
  plugins: [
    pluginComponentTokens({
      test: {
        negative: { value: 'red.200' },
        positive: { value: 'green.500' },
      },
    }),
    pluginResponsiveVariants(),
  ],
});
