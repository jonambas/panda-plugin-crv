import { defineConfig } from '@pandacss/dev';
import { pluginCreateResponsiveVariants } from 'panda-plugin-crv';
import { semanticTokens } from '../fixtures/tokens';

export default defineConfig({
  preflight: true,
  include: ['./{src,pages,app}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      semanticTokens,
      breakpoints: {
        bigbig: '2000px',
      },
    },
  },
  outdir: 'styled-system',
  plugins: [pluginCreateResponsiveVariants()],
});
