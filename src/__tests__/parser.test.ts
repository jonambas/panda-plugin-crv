import { parsers } from '../parsers';
import { context } from './fixtures';

export const makeParser = (content: string) => {
  return parsers(
    {
      configure: () => {},
      filePath: 'test.tsx',
      content,
    },
    context,
  );
};

describe('parsers', () => {
  it('parses', () => {
    const res = makeParser(`
    import foo from 'bar';
    import { css, crv, cva, ccv } from '@/styled-system/css';

    const styles = cva({
      variants: {
        ...crv('tone', {
          negative: { bg: "red.200" },
          positive: { bg: "green.200" }
        }),
      },
      compoundVariants: [
        ...ccv({ tone: 'negative', size: 'sm' }, { bg: 'amber.400' }),
      ]
    });
    `);

    expect(res).toMatchInlineSnapshot(
      `
      "import foo from 'bar';
          import { css, crv, cva, ccv } from '@/styled-system/css';

          const styles = cva({
            variants: {
              ...{tone: {negative: { bg: "red.200" },positive: { bg: "green.200" },},tone_sm: {negative: {'sm':{ bg: "red.200" },},positive: {'sm':{ bg: "green.200" },},},tone_md: {negative: {'md':{ bg: "red.200" },},positive: {'md':{ bg: "green.200" },},},tone_2lg: {negative: {'2lg':{ bg: "red.200" },},positive: {'2lg':{ bg: "green.200" },},},},
            },
            compoundVariants: [
              {tone: 'negative',size: 'sm',css: {bg: 'amber.400',},{tone: 'negative',size: 'sm',css: {'sm': {bg: 'amber.400',}},},{tone: 'negative',size: 'sm',css: {'md': {bg: 'amber.400',}},},{tone: 'negative',size: 'sm',css: {'2lg': {bg: 'amber.400',}},},
            ]
          });
          "
    `,
    );
  });

  it('parses with an import alias', () => {
    const res = makeParser(`
    import { css, crv as alias, cva } from '@/styled-system/css';

    const styles = cva({
      variants: {
        ...alias('variant', {
          foo: {},
          bar: {},
        }),
      }
    });
    `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, crv as alias, cva } from '@/styled-system/css';

          const styles = cva({
            variants: {
              ...{variant: {foo: {},bar: {},},variant_sm: {foo: {'sm':{},},bar: {'sm':{},},},variant_md: {foo: {'md':{},},bar: {'md':{},},},variant_2lg: {foo: {'2lg':{},},bar: {'2lg':{},},},},
            }
          });
          "
    `);
  });

  it('parses without style object', () => {
    const res = makeParser(`
    import { css, crv, cva } from '@/styled-system/css';

    const styles = cva({
      variants: {
        ...crv('tone'),
      }
    });
    `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, crv, cva } from '@/styled-system/css';

          const styles = cva({
            variants: {
              ...crv('tone'),
            }
          });
          "
    `);
  });

  it('skips without crv imports or expressions', () => {
    expect(
      makeParser(`<div className={css({ bg: crv("test", {}) })/>`),
    ).toBeUndefined();

    expect(
      makeParser(`import { crv } from '@/styled-system/css`),
    ).toBeUndefined();
  });

  it('skips without crv return value', () => {
    expect(
      makeParser(`
        import { crv, cva } from '@/styled-system/css';

        const styles = cva({
          variants: {
            ...crv(),
          }
        });
      `),
    ).toMatchInlineSnapshot(`
      "import { crv, cva } from '@/styled-system/css';

              const styles = cva({
                variants: {
                  ...crv(),
                }
              });
            "
    `);
  });

  it('parses nested objects', () => {
    const res = makeParser(`
    import { css, crv, cva } from '@/styled-system/css';

    const styles = cva({
      variants: {
        ...crv('tone', {
          positive: {
            foo: { bar: { baz: {}}}
          }
        }),
      }
    });
    `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, crv, cva } from '@/styled-system/css';

          const styles = cva({
            variants: {
              ...{tone: {positive: { foo: { bar: { baz: {}}} },},tone_sm: {positive: {'sm':{ foo: { bar: { baz: {}}} },},},tone_md: {positive: {'md':{ foo: { bar: { baz: {}}} },},},tone_2lg: {positive: {'2lg':{ foo: { bar: { baz: {}}} },},},},
            }
          });
          "
    `);
  });

  it('parses different quote styles', () => {
    const res = makeParser(`
    import { css, crv, cva } from '@/styled-system/css';

    const styles = cva({
      variants: {
        ...crv("tone", {
          positive: {
            'single': '#fff',
            "double": "#fff",
            tick: \`#fff\`,
            literal: \`\${'#fff'}\`
          }
        }),
      }
    });
    `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, crv, cva } from '@/styled-system/css';

          const styles = cva({
            variants: {
              ...{tone: {positive: { 'single': '#fff', "double": "#fff", tick: \`#fff\`, literal: \`\${'#fff'}\` },},tone_sm: {positive: {'sm':{ 'single': '#fff', "double": "#fff", tick: \`#fff\`, literal: \`\${'#fff'}\` },},},tone_md: {positive: {'md':{ 'single': '#fff', "double": "#fff", tick: \`#fff\`, literal: \`\${'#fff'}\` },},},tone_2lg: {positive: {'2lg':{ 'single': '#fff', "double": "#fff", tick: \`#fff\`, literal: \`\${'#fff'}\` },},},},
            }
          });
          "
    `);
  });

  it('parses booleans', () => {
    const res = makeParser(`
      import { css, crv, cva } from '@/styled-system/css';

      const styles = cva({
        variants: {
          ...crv('visible', {
            true: { srOnly: false },
            false: { srOnly: true }
          }),
        },
      });
      `);

    expect(res).toMatchInlineSnapshot(
      `
      "import { css, crv, cva } from '@/styled-system/css';

            const styles = cva({
              variants: {
                ...{visible: {true: { srOnly: false },false: { srOnly: true },},visible_sm: {true: {'sm':{ srOnly: false },},false: {'sm':{ srOnly: true },},},visible_md: {true: {'md':{ srOnly: false },},false: {'md':{ srOnly: true },},},visible_2lg: {true: {'2lg':{ srOnly: false },},false: {'2lg':{ srOnly: true },},},},
              },
            });
            "
    `,
    );
  });

  it('parses numbers', () => {
    const res = makeParser(`
      import { css, crv, cva } from '@/styled-system/css';

      const styles = cva({
        variants: {
          ...crv('tone', {
            positive: {
              number: 0
            }
          }),
        }
      });
      `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, crv, cva } from '@/styled-system/css';

            const styles = cva({
              variants: {
                ...{tone: {positive: { number: 0 },},tone_sm: {positive: {'sm':{ number: 0 },},},tone_md: {positive: {'md':{ number: 0 },},},tone_2lg: {positive: {'2lg':{ number: 0 },},},},
              }
            });
            "
    `);
  });

  it('parses funcs', () => {
    const res = makeParser(`
      import { css, crv, cva } from '@/styled-system/css';
  
      const styles = cva({
        variants: {
          ...crv('tone', {
            positive: {
              bg: get('color') 
            },
            negative: {
              bg: get('color2') 
            }
          }),
        }
      });
      `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, crv, cva } from '@/styled-system/css';
        
            const styles = cva({
              variants: {
                ...{tone: {positive: { bg: get('color') },negative: { bg: get('color2') },},tone_sm: {positive: {'sm':{ bg: get('color') },},negative: {'sm':{ bg: get('color2') },},},tone_md: {positive: {'md':{ bg: get('color') },},negative: {'md':{ bg: get('color2') },},},tone_2lg: {positive: {'2lg':{ bg: get('color') },},negative: {'2lg':{ bg: get('color2') },},},},
              }
            });
            "
    `);
  });
});
