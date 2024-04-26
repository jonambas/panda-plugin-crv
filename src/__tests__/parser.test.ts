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

describe('crv parser', () => {
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

describe.only('ccv parser', () => {
  it.only('parses', () => {
    const res = makeParser(`
    import foo from 'bar';
    import { css, cva, ccv } from '@/styled-system/css';

    const styles = cva({
      compoundVariants: [
        ...ccv({
          variant1: 'red',
          variant2: 'blue',
          css: { bg: 'green' }
        }),
      ],
    });
    `);

    expect(res).toMatchInlineSnapshot(`
      "import foo from 'bar';
          import { css, cva, ccv } from '@/styled-system/css';

          const styles = cva({
            compoundVariants: [
              {variant1: 'red',variant2: 'blue',css: {bg: 'green',},{variant1_sm: 'red',variant2_sm: 'blue',css: {'sm': {bg: 'green',}},},{variant1_md: 'red',variant2_md: 'blue',css: {'md': {bg: 'green',}},},{variant1_2lg: 'red',variant2_2lg: 'blue',css: {'2lg': {bg: 'green',}},},
            ],
          });
          "
    `);
  });

  it('parses with an import alias', () => {
    const res = makeParser(`
    import { css, ccv as alias, cva } from '@/styled-system/css';

    const styles = cva({
      compoundVariants: [
        ...alias({
          variant1: 'red',
          variant2: 'blue',
          css: { bg: 'green' }
        }),
      ],
    });
    `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, ccv as alias, cva } from '@/styled-system/css';

          const styles = cva({
            compoundVariants: [
              {variant1: 'red',variant2: 'blue',css: {bg: 'green',},{variant1_sm: 'red',variant2_sm: 'blue',css: {'sm': {bg: 'green',}},},{variant1_md: 'red',variant2_md: 'blue',css: {'md': {bg: 'green',}},},{variant1_2lg: 'red',variant2_2lg: 'blue',css: {'2lg': {bg: 'green',}},},
            ],
          });
          "
    `);
  });

  it('parses without style object', () => {
    const res = makeParser(`
    import { css, crv, cva } from '@/styled-system/css';

    const styles = cva({
      compoundVariants: [
        ...ccv({
          variant1: 'red',
          variant2: 'blue'
        }),
      ],
    });
    `);

    expect(res).toBeUndefined();
  });

  it('skips without crv imports or expressions', () => {
    expect(makeParser(`ccv({}, {})`)).toBeUndefined();

    expect(
      makeParser(`import { ccv } from '@/styled-system/css`),
    ).toBeUndefined();
  });

  it('skips without crv return value', () => {
    expect(
      makeParser(`
        import { ccv, cva } from '@/styled-system/css';

        const styles = cva({
          compoundVariants: [
            ...ccv(),
          ],
        });
      `),
    ).toMatchInlineSnapshot(`
      "import { ccv, cva } from '@/styled-system/css';

              const styles = cva({
                compoundVariants: [
                  ...ccv(),
                ],
              });
            "
    `);
  });

  it('parses nested objects', () => {
    const res = makeParser(`
    import { css, ccv, cva } from '@/styled-system/css';

    const styles = cva({
      compoundVariants: [
        ...ccv({
          variant1: 'red',
          variant2: 'blue',
          css: { foo: { bar: { baz: '#fff' }} }
        }),
      ],
    });
    `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, ccv, cva } from '@/styled-system/css';

          const styles = cva({
            compoundVariants: [
              {variant1: 'red',variant2: 'blue',css: {foo: { bar: { baz: '#fff' }},},{variant1_sm: 'red',variant2_sm: 'blue',css: {'sm': {foo: { bar: { baz: '#fff' }},}},},{variant1_md: 'red',variant2_md: 'blue',css: {'md': {foo: { bar: { baz: '#fff' }},}},},{variant1_2lg: 'red',variant2_2lg: 'blue',css: {'2lg': {foo: { bar: { baz: '#fff' }},}},},
            ],
          });
          "
    `);
  });

  it('parses different quote styles', () => {
    const res = makeParser(`
    import { css, ccv, cva } from '@/styled-system/css';

    const styles = cva({
      compoundVariants: [
        ...ccv({
          variant1: 'red',
          variant2: 'blue',
          css: { foo: { '& > *': { "3baz": \`\${'#fff'}\`}}}
        }),
      ],
    });
    `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, ccv, cva } from '@/styled-system/css';

          const styles = cva({
            compoundVariants: [
              {variant1: 'red',variant2: 'blue',css: {foo: { '& > *': { "3baz": \`\${'#fff'}\`}},},{variant1_sm: 'red',variant2_sm: 'blue',css: {'sm': {foo: { '& > *': { "3baz": \`\${'#fff'}\`}},}},},{variant1_md: 'red',variant2_md: 'blue',css: {'md': {foo: { '& > *': { "3baz": \`\${'#fff'}\`}},}},},{variant1_2lg: 'red',variant2_2lg: 'blue',css: {'2lg': {foo: { '& > *': { "3baz": \`\${'#fff'}\`}},}},},
            ],
          });
          "
    `);
  });

  it('parses booleans', () => {
    const res = makeParser(`
      import { css, ccv, cva } from '@/styled-system/css';

      const styles = cva({
        compoundVariants: [
          ...ccv({
            variant1: true,
            variant2: false,
            css: { foo: { bar: { srOnly: false }} }
          }),
        ],
      });
      `);

    expect(res).toMatchInlineSnapshot(
      `
      "import { css, ccv, cva } from '@/styled-system/css';

            const styles = cva({
              compoundVariants: [
                {variant1: true,variant2: false,css: {foo: { bar: { srOnly: false }},},{variant1_sm: true,variant2_sm: false,css: {'sm': {foo: { bar: { srOnly: false }},}},},{variant1_md: true,variant2_md: false,css: {'md': {foo: { bar: { srOnly: false }},}},},{variant1_2lg: true,variant2_2lg: false,css: {'2lg': {foo: { bar: { srOnly: false }},}},},
              ],
            });
            "
    `,
    );
  });

  it('parses numbers', () => {
    const res = makeParser(`
      import { css, ccv, cva } from '@/styled-system/css';

      const styles = cva({
        compoundVariants: [
          ...ccv({
            variant1: 1,
            variant2: 0,
            css: { foo: { opacity: 0.5 }}
          }),
        ],
      });
      `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, ccv, cva } from '@/styled-system/css';

            const styles = cva({
              compoundVariants: [
                {variant1: 1,variant2: 0,css: {foo: { opacity: 0.5 },},{variant1_sm: 1,variant2_sm: 0,css: {'sm': {foo: { opacity: 0.5 },}},},{variant1_md: 1,variant2_md: 0,css: {'md': {foo: { opacity: 0.5 },}},},{variant1_2lg: 1,variant2_2lg: 0,css: {'2lg': {foo: { opacity: 0.5 },}},},
              ],
            });
            "
    `);
  });

  it('parses funcs', () => {
    const res = makeParser(`
      import { css, ccv, cva } from '@/styled-system/css';

      const styles = cva({
        compoundVariants: [
          ...ccv({
            variant1: 1,
            variant2: 0,
            css: { foo: { opacity: get('test'), bg: \`\${get('test')}\` }}
          }),
        ],
      });
      `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, ccv, cva } from '@/styled-system/css';

            const styles = cva({
              compoundVariants: [
                {variant1: 1,variant2: 0,css: {foo: { opacity: get('test'), bg: \`\${get('test')}\` },},{variant1_sm: 1,variant2_sm: 0,css: {'sm': {foo: { opacity: get('test'), bg: \`\${get('test')}\` },}},},{variant1_md: 1,variant2_md: 0,css: {'md': {foo: { opacity: get('test'), bg: \`\${get('test')}\` },}},},{variant1_2lg: 1,variant2_2lg: 0,css: {'2lg': {foo: { opacity: get('test'), bg: \`\${get('test')}\` },}},},
              ],
            });
            "
    `);
  });
});
