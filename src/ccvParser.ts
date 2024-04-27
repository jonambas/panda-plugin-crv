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
  value: ObjectLiteralExpression;
  bp?: string;
  isLast?: boolean;
  breakpoints?: string[];
};

export const write = (args: WriterArgs): WriterFunction => {
  const { variants, value, breakpoints = [] } = args;
  return (writer) => {
    writeObject({ writer, variants, value });

    for (const [i, bp] of breakpoints.entries()) {
      writeObject({
        writer,
        variants,
        value,
        bp,
        isLast: i === breakpoints.length - 1,
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
        const initializer = property.getInitializer()?.getText() ?? '';
        writer
          .conditionalWrite(!!bp, `${makeKey(property.getName(), bp!)}: `)
          .conditionalWrite(!!bp, `${clean(initializer)},`)
          .conditionalWrite(!bp, `${clean(property.getText())},`);
      }
      writer.write('css:').inlineBlock(() => {
        writer.conditionalWrite(!!bp, `'${bp}': {`);
        for (const variant of value.getProperties()) {
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
  const { breakpoints, debug } = context;

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

    debug?.(
      'plugin:crv',
      `ccv replacing { ${variants.map((v) => `${v.getText()}, `)}}`,
    );
    spread.replaceWithText(write({ variants, value: style, breakpoints }));
  }

  return source.getText();
};
