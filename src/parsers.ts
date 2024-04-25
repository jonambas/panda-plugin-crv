import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import type { PluginContext } from './types';
import { crvParser } from './crvParser';
import { ccvParser } from './ccvParser';

export const parsers = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
): string | void => {
  const { project } = context;

  const source = project.createSourceFile('__crv-parser.tsx', args.content, {
    overwrite: true,
  });

  const crv = crvParser(args, context, source);
  const ccv = ccvParser(args, context, source);

  if (!crv && !ccv) return;
  return source.getText();
};
