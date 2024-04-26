import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import { SourceFile, ts } from 'ts-morph';
import type { PluginContext } from './types';
import { ccv } from './ccv';
import { makeObject } from './object';

export const ccvParser = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
  source: SourceFile,
): string | void => {
  let exists = false;
  let alias = 'ccv';

  for (const node of source.getImportDeclarations()) {
    if (!node.getText().includes('ccv')) continue;
    for (const named of node.getNamedImports()) {
      if (named.getText() === 'ccv' || named.getText().startsWith('ccv as')) {
        exists = true;
        alias = named.getAliasNode()?.getText() ?? 'ccv';
      }
    }
  }

  if (!exists) return;

  // Panda bug: spreads are not parsed in compoundVariants
  const calls = source
    .getDescendantsOfKind(ts.SyntaxKind.SpreadElement)
    .filter((node) => node.getExpression()?.getText().startsWith(alias));

  if (!calls.length) return;

  for (const node of calls) {
    const call = node.getExpressionIfKind(ts.SyntaxKind.CallExpression);

    if (!call) continue;

    const variants = call.getArguments()[0];
    const styles = call.getArguments()[1];
    const value = ccv(
      makeObject(variants),
      makeObject(styles),
      context.breakpoints,
    );

    if (!value) continue;

    // Replace full node with spread
    node.replaceWithText(JSON.stringify(value));
  }

  context.debug?.(
    `plugin:crv`,
    `Replaced ${calls.length} ccv calls in: ${args.filePath.split('/').at(-1)}`,
  );

  return source.getText();
};
