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

export const ccv = (args) => {
  const { css, ...variants }  = args;
  if (!variants || !css) return [];

  const compoundVariants = [{ ...variants, css }];

  for (const [bp, keys] of groupByBreakpoint(variants)) {
    compoundVariants.push({ ...keys, css: { [bp]: css } });
  }

  return compoundVariants;
};`;

export const ccvDts = `

type 
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
 *    { variant1: 'red', variant2: 'blue', css: { bg: 'green' }},
 *   )
 * ]
 */
export declare const ccv: <T extends Record<any, any> & { css: SystemStyleObject }>(
  args: T,
) => Array<{ css: T['css'] } & Record<keyof T, any>>;
`;
