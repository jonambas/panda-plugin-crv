import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import {
  CodeBlockWriter,
  ObjectLiteralExpression,
  SourceFile,
  ts,
} from 'ts-morph';
import type { PluginContext } from './types';
import { makeKey } from './crv';

const clean = (str: string) => str.replace(/^\s+|\s+$|\s+(?=\s)/g, '');

type WriterArgs = {
  writer: CodeBlockWriter;
  variants: ObjectLiteralExpression;
  value: ObjectLiteralExpression;
  bp?: string;
  isLast?: boolean;
};

export const writeObject = (args: WriterArgs) => {
  const { writer, variants, value, bp, isLast } = args;

  writer.write('{');

  for (const property of variants.getProperties()) {
    if (!property.isKind(ts.SyntaxKind.PropertyAssignment)) continue;
    const initializer = property.getInitializer()?.getText() ?? '';
    if (bp) {
      writer.write(`${makeKey(property.getName(), bp)}: `);
      writer.write(`${clean(initializer)},`);
    } else {
      writer.write(`${clean(property.getText())},`);
    }
  }
  writer.write('css: {');

  if (bp) writer.write(`'${bp}': {`);
  for (const variant of value.getProperties()) {
    writer.write(`${clean(variant.getText())},`);
  }
  if (bp) writer.write(`}},`);
  writer.write(isLast ? '}' : '},');
};

export const ccvParser = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
  source: SourceFile,
  alias: string = 'ccv',
): string | void => {
  const { breakpoints, debug } = context;

  // Panda bug: spreads are not parsed in compoundVariants
  // Target spread elements so that we can replace them later
  const spreads = source
    .getDescendantsOfKind(ts.SyntaxKind.SpreadElement)
    .filter((node) => node.getExpression()?.getText().startsWith(alias));

  if (!spreads.length) return;

  for (const node of spreads) {
    const call = node.getExpressionIfKind(ts.SyntaxKind.CallExpression);

    if (!call) continue;

    const [variants, style] = call.getArguments();

    if (!style || !style.isKind(ts.SyntaxKind.ObjectLiteralExpression)) {
      continue;
    }

    const replaced = node.replaceWithText((writer) => {
      if (!variants.isKind(ts.SyntaxKind.ObjectLiteralExpression)) return;

      writeObject({ writer, variants, value: style });

      for (const [i, bp] of breakpoints.entries()) {
        writeObject({
          writer,
          variants,
          value: style,
          bp,
          isLast: i === breakpoints.length - 1,
        });
      }
    });

    debug?.(
      `plugin:crv`,
      `ccv: '${replaced.getText()}': ${args.filePath.split('/').at(-1)}`,
    );
  }

  return source.getText();
};
