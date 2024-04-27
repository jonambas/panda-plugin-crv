import {
  CodeBlockWriter,
  ObjectLiteralElementLike,
  SourceFile,
  ts,
  WriterFunction,
} from 'ts-morph';
import { makeKey } from './crv';
import type { PluginContext } from './types';

const clean = (str: string) => str.replace(/^\s+|\s+$|\s+(?=\s)/g, '');

type WriterArgs = {
  key: string;
  value: ObjectLiteralElementLike[];
  bp?: string;
  isLast?: boolean;
  breakpoints?: string[];
};

const write = (args: WriterArgs): WriterFunction => {
  const { key, value, breakpoints = [] } = args;
  return (writer) => {
    writer.inlineBlock(() => {
      writeObject({ writer, key, value });
      for (const bp of breakpoints) {
        writeObject({ writer, key: makeKey(key, bp), value, bp });
      }
    });
  };
};

const writeObject = (args: WriterArgs & { writer: CodeBlockWriter }) => {
  const { writer, key, value, bp } = args;
  writer
    .write(`${key}:`)
    .inlineBlock(() => {
      for (const variant of value) {
        if (!variant.isKind(ts.SyntaxKind.PropertyAssignment)) continue;
        if (bp) {
          const initializer = variant.getInitializer()?.getText() ?? '';
          writer
            .write(`${variant.getName()}: `)
            .inlineBlock(() => {
              writer.write(`'${bp}': `);
              writer.write(`${clean(initializer)},`);
            })
            .write(', ');
        } else {
          writer.writeLine(`${clean(variant.getText())}, `);
        }
      }
    })
    .write(',\n');
};

export const crvParser = (
  context: PluginContext,
  source: SourceFile,
  alias: string = 'crv',
) => {
  const { breakpoints } = context;
  const calls = source
    .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === alias);

  if (!calls.length) return;

  for (const call of calls) {
    const [prop, style] = call.getArguments();
    let key = '';

    // This first arg should always be a string anyways
    if (prop && prop.isKind(ts.SyntaxKind.StringLiteral)) {
      key = prop.getLiteralValue();
    }

    if (!style || !style.isKind(ts.SyntaxKind.ObjectLiteralExpression)) {
      continue;
    }

    call.replaceWithText(
      write({ key, value: style.getProperties(), breakpoints }),
    );
  }

  return source.getText();
};
