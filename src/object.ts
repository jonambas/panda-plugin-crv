import { type Node, ts } from 'ts-morph';

export const makeObject = (node: Node) => {
  if (!node || !node.isKind(ts.SyntaxKind.ObjectLiteralExpression)) return {};
  if (!node?.getProperties?.().length) return {};

  const obj: Record<string, any> = {};

  for (const prop of node.getProperties()) {
    if (prop.isKind(ts.SyntaxKind.PropertyAssignment)) {
      const initializer = prop.getInitializer();
      const nameNode = prop.getNameNode();

      if (!initializer) return obj;

      const name = nameNode.isKind(ts.SyntaxKind.StringLiteral)
        ? nameNode.getLiteralText()
        : prop.getName();

      let value;

      if (initializer.isKind(ts.SyntaxKind.ObjectLiteralExpression)) {
        value = makeObject(initializer);
      }

      // This doesn't work, plugin needs to come after call expression are replaced
      if (initializer.isKind(ts.SyntaxKind.CallExpression)) {
        value = initializer.getText();
      }

      if (
        initializer.isKind(ts.SyntaxKind.StringLiteral) ||
        initializer.isKind(ts.SyntaxKind.NumericLiteral) ||
        initializer.isKind(ts.SyntaxKind.TrueKeyword) ||
        initializer.isKind(ts.SyntaxKind.FalseKeyword) ||
        initializer.isKind(ts.SyntaxKind.NoSubstitutionTemplateLiteral)
      ) {
        value = initializer.getLiteralValue();
      }

      // Not sure if this works
      if (initializer.isKind(ts.SyntaxKind.TemplateExpression)) {
        value = initializer.getText();
      }

      obj[name] = value;
    }
  }
  return obj;
};
