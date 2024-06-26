import { ccvDts, ccvFunc } from './ccv';

// Utilities

export const makeKey = <T extends string, B extends string>(name: T, bp: B) => {
  return `${name}_${bp}` as `${T}_${B}`;
};

// Codegen

export const crvFunc = (breakpoints: string[]) => `
const crvBreakpoints = [${breakpoints.map((bp) => `'${bp}'`).join(', ')}];

const makeKey = (name, bp) => {
  return \`\${name}_\${bp}\`;
}

const injectBreakpoint = (styles, breakpoint) => {
  return Object.fromEntries(
    Object.entries(styles).map(([key, css]) => [[key], { [breakpoint]: css }]),
  );
};

export const crv = (name, styles) => {
  if (!name) return;

  const variants = {
    [name]: styles,
  };

  for (const bp of crvBreakpoints) {
    variants[makeKey(name, bp)] = injectBreakpoint(styles, bp);
  }

  return variants;
};

export const splitResponsiveVariant = (name, value) => {
  if (typeof value !== 'object') {
    return { [name]: value };
  }

  const { base, ...rest } = value;
  let variants = { [name]: base };

  for (const bp of crvBreakpoints) {
    if (!(bp in rest)) continue;
    variants[makeKey(name, bp)] = rest[bp];
  }

  return variants;
};

export const splitCrv = splitResponsiveVariant;

${ccvFunc}
`;

export const crvFuncDts = (breakpoints: string[]) => `/* eslint-disable */
import type { SystemStyleObject } from '../types/system-types';

type CrvBreakpoints = ${breakpoints.map((bp) => `'${bp}'`).join(' | ')};

/**
 * Create responsive variants
 *
 * @example
 * cva({
 *  variants: {
 *    ...crv('prop', {
 *      variant1: { color: 'red' },
 *      variant2: { color: 'blue' }
 *    })
 * })
 */
export declare const crv: <T extends string, P extends Record<any, SystemStyleObject>>(
  name: T,
  styles: P
) => Record<\`\${T}_\${CrvBreakpoints}\` | T, P>;

/**
 * Splits responsive objects into \`crv\` variants
 */
type SplitResponsiveVariant = <T extends string>(
  name: T,
  value: any
) => Record<\`\${T}_\${CrvBreakpoints}\` | T, any>;

export declare const splitCrv: SplitResponsiveVariant;
export declare const splitResponsiveVariant: SplitResponsiveVariant;

export type ResponsiveVariant<T> = Partial<Record<'base' | CrvBreakpoints, T>> | T;

${ccvDts}
`;
