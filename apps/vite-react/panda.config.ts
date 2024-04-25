import { defineConfig } from '@pandacss/dev';
import { pluginResponsiveVariants } from 'panda-plugin-crv';

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
  plugins: [pluginResponsiveVariants()],
});
