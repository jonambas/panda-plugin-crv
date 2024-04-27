import {
  CodeBlockWriter,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  SourceFile,
  ts,
  WriterFunction,
} from 'ts-morph';
import type { PluginContext } from './types';
import { makeKey } from './crv';

const clean = (str: string) => str.replace(/^\s+|\s+$|\s+(?=\s)/g, '');

type WriterArgs = {
  variants: ObjectLiteralElementLike[];
  value: ObjectLiteralElementLike[];
  bp?: string;
  isLast?: boolean;
  breakpoints?: string[];
};

export const write = (args: WriterArgs): WriterFunction => {
  const { variants, value, breakpoints = [] } = args;
  return (writer) => {
    writeObject({ writer, variants, value });

    for (const bp of breakpoints) {
      writeObject({
        writer,
        variants,
        value,
        bp,
        isLast: bp === breakpoints.at(-1),
      });
    }
  };
};

export const writeObject = (args: WriterArgs & { writer: CodeBlockWriter }) => {
  const { writer, variants, value, bp, isLast } = args;

  writer
    .inlineBlock(() => {
      for (const property of variants) {
        if (!property.isKind(ts.SyntaxKind.PropertyAssignment)) continue;
        if (bp) {
          const initializer = property.getInitializer()?.getText() ?? '';
          writer
            .write(`${makeKey(property.getName(), bp!)}: `)
            .write(`${clean(initializer)},\n`);
        } else {
          writer.write(`${clean(property.getText())},\n`);
        }
      }

      writer.write('css: ').inlineBlock(() => {
        writer.conditionalWrite(!!bp, `'${bp}': {`);
        for (const variant of value) {
          writer.write(`${clean(variant.getText())},`);
        }
        writer.conditionalWrite(!!bp, `},`);
      });
    })
    .conditionalWrite(!isLast, ',');
};

export const ccvParser = (
  context: PluginContext,
  source: SourceFile,
  alias: string = 'ccv',
) => {
  const { breakpoints } = context;

  // Panda bug: spreads are not parsed in compoundVariants
  // Target spread elements so that we can replace them later
  const spreads = source
    .getDescendantsOfKind(ts.SyntaxKind.SpreadElement)
    .filter((node) => node.getExpression().getText().startsWith(alias));

  if (!spreads.length) return;

  for (const spread of spreads) {
    const call = spread.getExpressionIfKind(ts.SyntaxKind.CallExpression);

    if (!call) continue;

    // Only one arg
    const callArgs = call.getArguments().at(0);
    if (!callArgs || !callArgs.isKind(ts.SyntaxKind.ObjectLiteralExpression))
      continue;

    const properties = callArgs.getChildrenOfKind(
      ts.SyntaxKind.PropertyAssignment,
    );

    const variants = properties.filter((prop) => prop.getName() !== 'css');
    const style = properties
      .find((prop) => prop.getName() === 'css')
      ?.getInitializer();

    if (!style || !style.isKind(ts.SyntaxKind.ObjectLiteralExpression)) {
      continue;
    }

    spread.replaceWithText(
      write({ variants, value: style.getProperties(), breakpoints }),
    );
  }

  return source.getText();
};
