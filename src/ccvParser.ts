import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import {
  CodeBlockWriter,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  SourceFile,
  ts,
} from 'ts-morph';
import type { PluginContext } from './types';
import { makeKey } from './crv';

const clean = (str: string) => str.replace(/^\s+|\s+$|\s+(?=\s)/g, '');

type WriterArgs = {
  writer: CodeBlockWriter;
  variants: ObjectLiteralElementLike[];
  value: ObjectLiteralExpression;
  bp?: string;
  isLast?: boolean;
};

export const writeObject = (args: WriterArgs) => {
  const { writer, variants, value, bp, isLast } = args;

  writer.write('{');

  for (const property of variants) {
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
  if (!bp) writer.write(`},`);
  writer.write(isLast ? '}' : '},');
};

export const ccvParser = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
  source: SourceFile,
  alias: string = 'ccv',
) => {
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

    // Only one aarg
    const callArgs = call.getArguments().at(0);
    if (!callArgs || !callArgs.isKind(ts.SyntaxKind.ObjectLiteralExpression))
      continue;

    const properties = callArgs.getProperties();
    let style;

    const variants = properties.filter((prop) => {
      if (!prop.isKind(ts.SyntaxKind.PropertyAssignment)) return false;
      return prop.getName() !== 'css';
    });

    for (const property of properties) {
      if (!property.isKind(ts.SyntaxKind.PropertyAssignment)) continue;
      if (property.getName() === 'css') {
        style = property.getInitializer();
      }
    }

    if (!style || !style.isKind(ts.SyntaxKind.ObjectLiteralExpression)) {
      continue;
    }

    const replaced = node.replaceWithText((writer) => {
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
