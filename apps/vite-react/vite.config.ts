import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import unplugin from '@pandabox/unplugin';
import { transform } from 'panda-plugin-ct';
import { componentTokens } from '../fixtures/tokens';

// TODO, split testing for this macro
// const plugins =
//   process.env.NODE_ENV === 'production'
//     ? [
//         unplugin.vite({
//           transform: transform(componentTokens),
//           optimizeJs: false,
//         }),
//       ]
//     : [];

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/styled-system': path.resolve(__dirname, './styled-system'),
    },
  },
  preview: {
    port: 3000,
  },
  plugins: [
    react(),
    //...plugins
  ],
});
