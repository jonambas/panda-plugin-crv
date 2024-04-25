import { Key, makeKey } from './crv';

export const renameKeys = <T extends Record<string, any>, B extends string[]>(
  variants: T,
  breakpoints: B,
) => {
  const result = [] as Record<any, any>[]; // todo

  for (const bp of breakpoints) {
    let renamed: Record<any, any> = {};
    for (const [key, value] of Object.entries(variants)) {
      renamed[makeKey(key, bp)] = value;
    }
    result.push(renamed);
  }
  return result as Array<{
    [K: string]: any; // todo
  }>;
};

export const ccv = (
  variants: Record<string, any>,
  styles: Record<any, any>,
  breakpoints: string[],
) => {
  if (!variants) return styles;

  const compoundVariants = [{ ...variants, css: styles }];
  const variantKeys = renameKeys(variants, breakpoints);

  for (const keys of variantKeys) {
    compoundVariants.push({
      ...keys,
      css: styles,
    });
  }

  return compoundVariants;
};

export const ccvFunc = `
const renameKeys = (variants) => {
  const result = [];

  for (const bp of crvBreakpoints) {
    let renamed = {};
    for (const [key, value] of Object.entries(variants)) {
      renamed[makeKey(key, bp)] = value;
    }
    result.push(renamed);
  }
  return result;
};

export const ccv = (variants, styles) => {
  if (!variants) return styles;

  const compoundVariants = [{ ...variants, css: styles }];
  const variantKeys = renameKeys(variants);

  for (const keys of variantKeys) {
    compoundVariants.push({
      ...keys,
      css: styles,
    });
  }

  return compoundVariants;
};
`;
