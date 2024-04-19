import unplugin from '@pandabox/unplugin';
import * as ct from 'panda-plugin-ct';

const tokens = {
  alert: {
    background: {
      value: 'blue.100',
    },
    text: {
      value: 'gray.100',
    },
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(
      unplugin.webpack({
        transform: ct.unplugin(tokens),
        optimizeJs: false,
        // transform: (args) => {
        //   console.log(args.content);
        // },
      }),
    );
    return config;
  },
};

export default nextConfig;
