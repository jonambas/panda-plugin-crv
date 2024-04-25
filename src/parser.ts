import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import { ts } from 'ts-morph';
import json5 from 'json5';
import { crv } from './crv';
import type { PluginContext } from './types';
import { ccv } from './ccv';

// TODO optimize this

export const parser = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
): string | void => {
  const { project } = context;

  const source = project.createSourceFile('__crv-parser.tsx', args.content, {
    overwrite: true,
  });

  let crvExists = false;
  let ccvExists = false;
  let crvAlias = 'crv';
  let ccvAlias = 'ccv';

  for (const node of source.getImportDeclarations()) {
    if (!node.getText().includes('crv')) continue;
    for (const named of node.getNamedImports()) {
      if (named.getText() === 'crv' || named.getText().startsWith('crv as')) {
        crvExists = true;
        crvAlias = named.getAliasNode()?.getText() ?? 'crv';
      }
      if (named.getText() === 'ccv' || named.getText().startsWith('ccv as')) {
        ccvExists = true;
        ccvAlias = named.getAliasNode()?.getText() ?? 'ccv';
      }
    }
  }

  if (!crvExists) return;

  const all = source.getDescendantsOfKind(ts.SyntaxKind.CallExpression);
  const crvCalls = all.filter(
    (node) => node.getExpression().getText() === crvAlias,
  );
  const ccvCalls = all.filter(
    (node) => node.getExpression().getText() === ccvAlias,
  );

  for (const node of crvCalls) {
    const prop = node.getArguments()[0]?.getText().replace(/['"]/g, '');
    const styles = node.getArguments()[1]?.getText() ?? '{}';
    const value = crv(prop, json5.parse(styles), context.breakpoints);

    if (!value) continue;
    node.replaceWithText(JSON.stringify(value));
  }

  for (const node of ccvCalls) {
    const variants = node.getArguments()[0]?.getText() ?? '{}';
    const styles = node.getArguments()[1]?.getText() ?? '{}';
    const value = ccv(
      json5.parse(variants),
      json5.parse(styles),
      context.breakpoints,
    );

    context.debug?.(`plugin:crv`, `${JSON.stringify(value, null, 2)}`);

    if (!value) continue;
    node.replaceWithText(JSON.stringify(value));
  }

  context.debug?.(
    `plugin:crv`,
    `Replaced ${crvCalls.length} crv calls in: ${args.filePath.split('/').at(-1)}`,
  );

  context.debug?.(
    `plugin:crv`,
    `Replaced ${ccvCalls.length} ccv calls in: ${args.filePath.split('/').at(-1)}`,
  );

  return crvCalls.length ? source.getText() : undefined;
};
