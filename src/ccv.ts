import { Key, makeKey } from './crv';

export const makeCompoundVariants = <
  T extends Record<string, any>,
  B extends string[],
>(
  variants: T,
  breakpoints: B,
) => {
  const result: Record<any, any> = {}; // todo

  for (const bp of breakpoints) {
    let renamed: Record<any, any> = {};
    for (const [key, value] of Object.entries(variants)) {
      renamed[makeKey(key, bp)] = value;
    }
    result[bp] = renamed;
  }
  return result;
};

const injectBreakpoint = (styles: Record<any, any>, breakpoint: string) => {
  let value = {};
  for (const key of Object.keys(styles)) {
    value = {
      ...value,
      [key]: { [breakpoint]: styles[key] },
    };
  }
  return value;
};

export const ccv = <T extends Record<any, any>, C extends Record<any, any>>(
  variants: T,
  css: C,
  breakpoints: string[],
) => {
  if (!variants) return [];

  const compoundVariants = [{ ...variants, css }] as Array<{
    [K: string]: any; // todo
  }>;

  const grouped = makeCompoundVariants(variants, breakpoints);

  for (const [bp, keys] of Object.entries(grouped)) {
    compoundVariants.push({
      ...keys,
      css: injectBreakpoint(css, bp),
    });
  }

  return compoundVariants;
};

export const ccvFunc = `
const makeCompoundVariants = (variants) => {
  const result = {}; // todo

  for (const bp of crvBreakpoints) {
    let renamed = {};
    for (const [key, value] of Object.entries(variants)) {
      renamed[makeKey(key, bp)] = value;
    }
    result[bp] = renamed;
  }
  return result;
};

const injectBreakpoint = (styles, breakpoint) => {
  let value = {};
  for (const key of Object.keys(styles)) {
    value = {
      ...value,
      [key]: { [breakpoint]: styles[key] },
    };
  }
  return value;
};

export const ccv = (variants, css) => {
  if (!variants) return [];

  const compoundVariants = [{ ...variants, css }];
  const grouped = makeCompoundVariants(variants);

  for (const [bp, keys] of Object.entries(grouped)) {
    compoundVariants.push({ ...keys, css: injectBreakpoint(css, bp)});
  }

  return compoundVariants;
};`;

export const ccvDts = `
/**
 * Create compound variants
 *
 * @example
 * variants: {
 *   crv({
 *    variants: {
 *      ...crv('prop', {
 *        variant1: { color: 'red' },
 *        variant2: { color: 'blue' }
 *      })
 *   })
 * },
 * compoundVariants: [
 *  ...ccv(
 *    { variant1: 'red', variant2: 'blue' },
 *    { bg: 'green' }
 *   )
 * ]
 */
export declare const ccv: <T extends Record<any, any>, P extends SystemStyleObject>(
  variants: T,
  css: P
) => Array<{ css: P } & Record<keyof T, any>>;
`;
