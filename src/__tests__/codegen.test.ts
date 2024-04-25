import { codegen } from '../codegen';
import { context } from './fixtures';

describe('codegen', () => {
  it('generates crv runtime code', () => {
    const result = codegen(
      {
        artifacts: [
          {
            id: 'css-fn',
            files: [],
          },
          {
            id: 'css-index',
            files: [
              { file: 'index.mjs', code: '// ...panda code' },
              { file: 'index.d.ts', code: '// ...panda code' },
            ],
          },
        ],
        changed: [],
      },
      context,
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "files": [
            {
              "code": "
      const crvBreakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'];

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
          compoundVariants.push({ ...keys, css: injectBreakpoint(css, bp)});
        }

        return compoundVariants;
      };
      ",
              "file": "crv.mjs",
            },
            {
              "code": "/* eslint-disable */
      import type { SystemStyleObject } from '../types/system-types';

      type CrvBreakpoints = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

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

      ",
              "file": "crv.d.ts",
            },
          ],
          "id": "css-fn",
        },
        {
          "files": [
            {
              "code": "// ...panda code
      export * from './crv.mjs';",
              "file": "index.mjs",
            },
            {
              "code": "// ...panda code
      export * from './crv';",
              "file": "index.d.ts",
            },
          ],
          "id": "css-index",
        },
      ]
    `);
  });

  it('generates crv runtime code with outExtension set to "js"', () => {
    const result = codegen(
      {
        artifacts: [
          {
            id: 'css-fn',
            files: [],
          },
          {
            id: 'css-index',
            files: [
              { file: 'index.js', code: '' },
              { file: 'index.d.ts', code: '' },
            ],
          },
        ],
        changed: [],
      },
      context,
    ) as any[];

    expect(result.at(0).files[0].file).toEqual('crv.js');
    expect(result.at(0).files[1].file).toEqual('crv.d.ts');
    expect(result.at(1).files[0].code).includes('./crv.js');
    expect(result.at(1).files[1].code).includes('./crv');
  });

  it('generates crv runtime code with outExtension set to "mjs" and force type extension', () => {
    const result = codegen(
      {
        artifacts: [
          {
            id: 'css-fn',
            files: [],
          },
          {
            id: 'css-index',
            files: [
              { file: 'index.mjs', code: '' },
              { file: 'index.d.mts', code: '' },
            ],
          },
        ],
        changed: [],
      },
      context,
    ) as any[];

    expect(result.at(0).files[0].file).toEqual('crv.mjs');
    expect(result.at(0).files[1].file).toEqual('crv.d.mts');
    expect(result.at(1).files[0].code).includes('./crv.mjs');
    expect(result.at(1).files[1].code).includes('./crv');
  });

  it('skips if artifacts dont exist', () => {
    const result = codegen(
      {
        artifacts: [],
        changed: [],
      },
      context,
    );

    expect(result).toEqual([]);
  });
});
