export const crv = <T extends string, P extends Record<any, any>>(
  name: T,
  styles: P,
  breakpoints: string[],
) => {
  const variants = {
    [name]: styles,
  } as Record<T | `${T}_${(typeof breakpoints)[number]}`, any>;

  for (const bp of breakpoints) {
    let value = {};

    for (const key of Object.keys(styles)) {
      value = {
        ...value,
        [key]: { [bp]: styles[key] },
      };
    }
    variants[`${name}_${bp}`] = value;
  }

  return variants;
};

export const crvFunc = (breakpoints: string[]) => `
const crvBreakpoints = [${breakpoints.map((bp) => `'${bp}'`).join(', ')}];
export const crv = (name, styles) => {
  const variants = {
    [name]: styles,
  };

  for (const bp of crvBreakpoints) {
    let value = {};

    for (const key of Object.keys(styles)) {
      value = {
        ...value,
        [key]: { [bp]: styles[key] },
      };
    }
    variants[\`\${name}_\${bp}\`] = value;
  }

  return variants;
};

export const splitCrv = (name, value) => {
  if (typeof value !== 'object') {
    return { [name]: value };
  }

  const { base, ...rest } = value;
  let variants = { [name]: base };

  for (const bp of crvBreakpoints) {
    variants[\`\${name}_\${bp}\`] = rest[bp];
  }

  return variants;
};`;

export const crvFuncDts = (breakpoints: string[]) => `/* eslint-disable */
import type { SystemStyleObject } from '../types/system-types';

type CrvBreakpoints = ${breakpoints.map((bp) => `'${bp}'`).join(' | ')};

export declare const crv: <T extends string, P extends Record<any, SystemStyleObject>>(
  name: T,
  styles: P
) => Record<\`\${T}_\${CrvBreakpoints}\` | T, P>;

export declare const splitCrv: <T extends string>(
  name: T,
  value: any
) => Record<\`\${T}_\${CrvBreakpoints}\` | T, any>;

export type ResponsiveVariant<T> = Partial<Record<'base' | CrvBreakpoints, T>> | T;`;
