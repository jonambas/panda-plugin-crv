import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import type { PluginContext } from './types';
import { crvParser } from './crvParser';
import { ccvParser } from './ccvParser';
import type { SourceFile } from 'ts-morph';

const names = ['ccv', 'crv'] as const;

const getImports = (source: SourceFile) => {
  const imports: Partial<Record<(typeof names)[number], string>> = {};

  for (const node of source.getImportDeclarations()) {
    let namesExist = false;

    for (const name of names) {
      if (node.getText().includes(name)) {
        namesExist = true;
        break;
      }
    }

    if (!namesExist) continue;

    for (const named of node.getNamedImports()) {
      for (const name of names) {
        if (
          named.getText() === name ||
          named.getText().startsWith(`${name} as`)
        ) {
          imports[name] = named.getAliasNode()?.getText() ?? name;
        }
      }
    }
  }

  return imports;
};

export const parsers = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
) => {
  const { project } = context;
  let changed: string | undefined = undefined;

  const source = project.createSourceFile('__crv-parser.tsx', args.content, {
    overwrite: true,
  });

  const imports = getImports(source);

  if (imports.crv) {
    changed = crvParser(args, context, source, imports.crv);
  }

  if (imports.ccv) {
    changed ??= ccvParser(args, context, source, imports.ccv);
  }

  if (!changed) return;
  return source.getText();
};
