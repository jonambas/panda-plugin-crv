import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import { ts } from 'ts-morph';
import json5 from 'json5';
import { crv } from './crv';
import type { PluginContext } from './types';

export const parser = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
): string | void => {
  const { project } = context;

  const source = project.createSourceFile('__crv-parser.tsx', args.content, {
    overwrite: true,
  });

  let exists = false;
  let alias = 'crv';

  for (const node of source.getImportDeclarations()) {
    if (!node.getText().includes('crv')) continue;
    for (const named of node.getNamedImports()) {
      if (named.getText() === 'crv' || named.getText().startsWith('crv as')) {
        exists = true;
        alias = named.getAliasNode()?.getText() ?? 'crv';
        break;
      }
    }
  }

  if (!exists) return;

  const calls = source
    .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === alias);

  for (const node of calls) {
    const prop = node.getArguments()[0]?.getText().replace(/['"]/g, '');
    const styles = node.getArguments()[1]?.getText() ?? '{}';
    const value = crv(prop, json5.parse(styles), context.breakpoints);
    node.replaceWithText(JSON.stringify(value, null, 2));
  }

  context.debug?.(
    `plugin:crv`,
    `Replaced ${calls.length} crv calls in: ${args.filePath.split('/').at(-1)}`,
  );

  return calls.length ? source.getText() : undefined;
};
