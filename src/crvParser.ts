import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import {
  CodeBlockWriter,
  ObjectLiteralExpression,
  SourceFile,
  ts,
} from 'ts-morph';
import { makeKey } from './crv';
import type { PluginContext } from './types';

const clean = (str: string) => str.replace(/^\s+|\s+$|\s+(?=\s)/g, '');

type WriterArgs = {
  writer: CodeBlockWriter;
  key: string;
  value: ObjectLiteralExpression;
  bp?: string;
  isLast?: boolean;
};

export const writeObject = (args: WriterArgs) => {
  const { writer, key, value, bp } = args;
  writer.write(`${key}: {`);

  for (const variant of value.getProperties()) {
    if (!variant.isKind(ts.SyntaxKind.PropertyAssignment)) continue;
    const initializer = variant.getInitializer()?.getText() ?? '';
    if (bp) {
      writer.write(`${variant.getName()}: {`);
      writer.write(`'${bp}':`);
      writer.write(`${clean(initializer)},`);
      writer.write(`},`);
    } else {
      writer.write(`${clean(variant.getText())},`);
    }
  }
  writer.write('},');
};

export const crvParser = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
  source: SourceFile,
  alias: string = 'crv',
) => {
  const { breakpoints, debug } = context;
  const calls = source
    .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === alias);

  if (!calls.length) return;

  for (const node of calls) {
    const prop = node.getArguments()[0];
    const style = node.getArguments()[1];
    let key = prop?.getText() ?? '';

    // This first arg should always be a string anyways
    if (prop && prop.isKind(ts.SyntaxKind.StringLiteral)) {
      key = prop.getLiteralValue();
    }

    if (!style || !style.isKind(ts.SyntaxKind.ObjectLiteralExpression)) {
      continue;
    }

    node.replaceWithText((writer) => {
      writer.write('{');
      writeObject({ writer, key, value: style });
      for (const bp of breakpoints) {
        writeObject({ writer, key: makeKey(key, bp), value: style, bp });
      }
      writer.write('}');
    });

    debug?.(`plugin:crv`, `crv: '${key}': ${args.filePath.split('/').at(-1)}`);
  }

  return source.getText();
};
