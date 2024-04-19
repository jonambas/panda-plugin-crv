import { defineConfig } from '@pandacss/dev';
import { pluginResponsiveVariants } from 'panda-plugin-crv';
import { semanticTokens } from '../fixtures/tokens';

export default defineConfig({
  preflight: true,
  include: ['./{src,pages,app}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      semanticTokens,
      breakpoints: {
        verybig: '2000px',
      },
    },
  },
  outdir: 'styled-system',
  plugins: [pluginResponsiveVariants()],
});
