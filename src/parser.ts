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

  const crvCalls = source
    .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === crvAlias);

  // Panda issue: spreading does not work in compoundVariants
  const ccvCalls = source
    .getDescendantsOfKind(ts.SyntaxKind.SpreadElement)
    .filter((node) => {
      console.log('\nccv', JSON.stringify(node.getExpression()?.getText()));
      console.log(node.getExpression()?.getText().startsWith(ccvAlias));
      return node.getExpression()?.getText().startsWith(ccvAlias);
    });

  for (const node of crvCalls) {
    const prop = node.getArguments()[0]?.getText().replace(/['"]/g, '');
    const styles = node.getArguments()[1]?.getText() ?? '{}';
    const value = crv(prop, json5.parse(styles), context.breakpoints);

    if (!value) continue;
    node.replaceWithText(JSON.stringify(value));
  }

  for (const node of ccvCalls) {
    const call = node.getExpressionIfKind(ts.SyntaxKind.CallExpression);
    console.log('\nccv', JSON.stringify(call?.getText()));

    if (!call) continue;

    console.log('\nccv', JSON.stringify(call.getArguments().at(0)?.getText()));

    const variants = call.getArguments()[0]?.getText() ?? '{}';
    console.log('\nccv', variants);
    const styles = call.getArguments()[1]?.getText() ?? '{}';
    console.log('\nccv', styles);
    const value = ccv(
      json5.parse(variants),
      json5.parse(styles),
      context.breakpoints,
    );

    if (!value) continue;
    console.log('\nccv', value);
    // Replace full node with spread
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

  console.log(source.getText());
  return source.getText();
};
