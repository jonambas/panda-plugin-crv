import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import { SourceFile, ts } from 'ts-morph';
import { crv } from './crv';
import type { PluginContext } from './types';
import { makeObject } from './object';

export const crvParser = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
  source: SourceFile,
): string | void => {
  let exists = false;
  let alias = 'crv';

  for (const node of source.getImportDeclarations()) {
    if (!node.getText().includes('crv')) continue;
    for (const named of node.getNamedImports()) {
      if (named.getText() === 'crv' || named.getText().startsWith('crv as')) {
        exists = true;
        alias = named.getAliasNode()?.getText() ?? 'crv';
      }
    }
  }

  if (!exists) return;

  const calls = source
    .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === alias);

  if (!calls.length) return;

  for (const node of calls) {
    const prop = node.getArguments()[0]?.getText().replace(/['"]/g, '');
    const styleArg = node.getArguments()[1];
    const value = crv(prop, makeObject(styleArg), context.breakpoints);

    if (!value) continue;
    node.replaceWithText(JSON.stringify(value));
  }

  context.debug?.(
    `plugin:crv`,
    `Replaced ${calls.length} crv calls in: ${args.filePath.split('/').at(-1)}`,
  );

  return source.getText();
};
