export const ccvFunc = `
const groupByBreakpoint = (variants) => {
  const result = {};

  for (const bp of crvBreakpoints) {
    let renamed = {};
    for (const [key, value] of Object.entries(variants)) {
      renamed[makeKey(key, bp)] = value;
    }
    result[bp] = renamed;
  }
  return Object.entries(result);
};

export const ccv = (variants, css) => {
  if (!variants || !css) return [];

  const compoundVariants = [{ ...variants, css }];

  for (const [bp, keys] of groupByBreakpoint(variants)) {
    compoundVariants.push({ ...keys, css: { [bp]: css } });
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
