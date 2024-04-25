import type { PandaPlugin } from '@pandacss/types';
import { parsers } from './parsers';
import { codegen } from './codegen';
import { createContext } from './context';

/**
 * 🐼 A Panda CSS plugin for creating responsive variants
 *
 * @see https://github.com/jonambas/panda-plugin-crv
 */
const pluginResponsiveVariants = (): PandaPlugin => {
  const context = createContext();
  return {
    name: 'panda-plugin-crv',
    hooks: {
      'context:created': (args) => {
        context.debug = args.logger?.debug;
        context.breakpoints = Object.keys(
          args.ctx.config.theme?.breakpoints ?? {},
        );
      },
      'parser:before': (args) => {
        return parsers(args, context);
      },
      'codegen:prepare': (args) => {
        return codegen(args, context);
      },
    },
  };
};

export { pluginResponsiveVariants };
