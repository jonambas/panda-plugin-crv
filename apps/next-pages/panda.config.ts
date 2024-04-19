
import { defineConfig } from '@pandacss/dev';
import { pluginComponentTokens } from 'panda-plugin-ct';
import { semanticTokens, componentTokens } from '../fixtures/tokens';

export default defineConfig({
  preflight: true,
  include: ['./{src,pages,app}/**/*.{js,jsx,ts,tsx}',],
  theme: { extend: { semanticTokens }},
  outdir: 'styled-system',
  plugins: [pluginComponentTokens(componentTokens)]
});
