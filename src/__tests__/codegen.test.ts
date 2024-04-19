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
      };",
              "file": "crv.mjs",
            },
            {
              "code": "/* eslint-disable */
      import type { SystemStyleObject } from '../types/system-types';

      type CrvBreakpoints = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

      export declare const crv: <T extends string, P extends Record<any, SystemStyleObject>>(
        name: T,
        styles: P
      ) => Record<\`\${T}_\${CrvBreakpoints}\` | T, P>;

      export declare const splitCrv: <T extends string>(
        name: T,
        value: any
      ) => Record<\`\${T}_\${CrvBreakpoints}\` | T, any>;

      export type ResponsiveVariant<T> = Partial<Record<'base' | CrvBreakpoints, T>> | T;",
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
