import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import type { PluginContext } from './types';
import { crvParser } from './crvParser';
import { ccvParser } from './ccvParser';
import type { SourceFile } from 'ts-morph';

const getImports = (source: SourceFile, name: string) => {
  let exists = false;
  let alias = name;

  for (const node of source.getImportDeclarations()) {
    if (!node.getText().includes(name)) continue;
    for (const named of node.getNamedImports()) {
      if (
        named.getText() === name ||
        named.getText().startsWith(`${name} as`)
      ) {
        exists = true;
        alias = named.getAliasNode()?.getText() ?? name;
      }
    }
  }

  return [exists, alias] as const;
};

export const parsers = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
): string | void => {
  const { project } = context;
  let ccv, crv;

  const source = project.createSourceFile('__crv-parser.tsx', args.content, {
    overwrite: true,
  });

  const [crvExists, crvAlias] = getImports(source, 'crv');
  const [ccvExists, ccvAlias] = getImports(source, 'ccv');

  if (!crvExists && !ccvExists) return;

  if (crvExists) {
    crv = crvParser(args, context, source, crvAlias);
  }

  if (ccvExists) {
    ccv = ccvParser(args, context, source, ccvAlias);
  }

  if (!crv && !ccv) return;

  return source.getText();
};
