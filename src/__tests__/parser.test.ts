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
      base: {
        // background: crv('nope'),
      },
      variants: {
        ...crv('tone', {
          negative: { bg: "red.200" },
          "positive": { bg: "green.200" }
        }),
        ...crv('size', {
          sm: { p: "4" },
          "lg": { p: "5" }
        }),
      },
      compoundVariants: [
        ...ccv({ tone: 'negative', size: 'sm' }, { bg: 'amber.400' }),
      ]
    });

    export const Component = () => {
      return (<div className={}
      />);
    `);

    expect(res).toMatchInlineSnapshot(
      `
      "import foo from 'bar';
          import { css, crv, cva, ccv } from '@/styled-system/css';

          const styles = cva({
            base: {
              // background: crv('nope'),
            },
            variants: {
              ...{"tone":{"negative":{"bg":"red.200"},"positive":{"bg":"green.200"}},"tone_sm":{"negative":{"sm":{"bg":"red.200"}},"positive":{"sm":{"bg":"green.200"}}},"tone_md":{"negative":{"md":{"bg":"red.200"}},"positive":{"md":{"bg":"green.200"}}},"tone_lg":{"negative":{"lg":{"bg":"red.200"}},"positive":{"lg":{"bg":"green.200"}}},"tone_xl":{"negative":{"xl":{"bg":"red.200"}},"positive":{"xl":{"bg":"green.200"}}},"tone_xxl":{"negative":{"xxl":{"bg":"red.200"}},"positive":{"xxl":{"bg":"green.200"}}}},
              ...{"size":{"sm":{"p":"4"},"lg":{"p":"5"}},"size_sm":{"sm":{"sm":{"p":"4"}},"lg":{"sm":{"p":"5"}}},"size_md":{"sm":{"md":{"p":"4"}},"lg":{"md":{"p":"5"}}},"size_lg":{"sm":{"lg":{"p":"4"}},"lg":{"lg":{"p":"5"}}},"size_xl":{"sm":{"xl":{"p":"4"}},"lg":{"xl":{"p":"5"}}},"size_xxl":{"sm":{"xxl":{"p":"4"}},"lg":{"xxl":{"p":"5"}}}},
            },
            compoundVariants: [
              [{"tone":"negative","size":"sm","css":{"bg":"amber.400"}},{"tone_sm":"negative","size_sm":"sm","css":{"bg":{"sm":"amber.400"}}},{"tone_md":"negative","size_md":"sm","css":{"bg":{"md":"amber.400"}}},{"tone_lg":"negative","size_lg":"sm","css":{"bg":{"lg":"amber.400"}}},{"tone_xl":"negative","size_xl":"sm","css":{"bg":{"xl":"amber.400"}}},{"tone_xxl":"negative","size_xxl":"sm","css":{"bg":{"xxl":"amber.400"}}}],
            ]
          });

          export const Component = () => {
            return (<div className={}
            />);
          "
    `,
    );
  });

  it('parses booleans', () => {
    const res = makeParser(`
    import foo from 'bar';
    import { css, crv, cva } from '@/styled-system/css';

    const styles = cva({
      base: {
        // background: crv('nope'),
      },
      variants: {
        ...crv('visible', {
          true: { opacity: 1 },
          false: { opacity: 0 }
        }),
      },
    });
    `);

    expect(res).toMatchInlineSnapshot(
      `
      "import foo from 'bar';
          import { css, crv, cva } from '@/styled-system/css';

          const styles = cva({
            base: {
              // background: crv('nope'),
            },
            variants: {
              ...{"visible":{"true":{"opacity":1},"false":{"opacity":0}},"visible_sm":{"true":{"sm":{"opacity":1}},"false":{"sm":{"opacity":0}}},"visible_md":{"true":{"md":{"opacity":1}},"false":{"md":{"opacity":0}}},"visible_lg":{"true":{"lg":{"opacity":1}},"false":{"lg":{"opacity":0}}},"visible_xl":{"true":{"xl":{"opacity":1}},"false":{"xl":{"opacity":0}}},"visible_xxl":{"true":{"xxl":{"opacity":1}},"false":{"xxl":{"opacity":0}}}},
            },
          });
          "
    `,
    );
  });

  it('parses with an alias', () => {
    const res = makeParser(`
    import { css, crv as alias, cva } from '@/styled-system/css';

    const styles = cva({
      base: {
        // background: crv('size', { foo: { bg: 'red'}}),
      },
      variants: {
        ...alias('tone', {
          neutral: { bg: "gray.200" },
          "negative": { bg: "red.200" },
          "positive": { bg: "green.200" }
        }),
      }
    });
    `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, crv as alias, cva } from '@/styled-system/css';

          const styles = cva({
            base: {
              // background: crv('size', { foo: { bg: 'red'}}),
            },
            variants: {
              ...{"tone":{"neutral":{"bg":"gray.200"},"negative":{"bg":"red.200"},"positive":{"bg":"green.200"}},"tone_sm":{"neutral":{"sm":{"bg":"gray.200"}},"negative":{"sm":{"bg":"red.200"}},"positive":{"sm":{"bg":"green.200"}}},"tone_md":{"neutral":{"md":{"bg":"gray.200"}},"negative":{"md":{"bg":"red.200"}},"positive":{"md":{"bg":"green.200"}}},"tone_lg":{"neutral":{"lg":{"bg":"gray.200"}},"negative":{"lg":{"bg":"red.200"}},"positive":{"lg":{"bg":"green.200"}}},"tone_xl":{"neutral":{"xl":{"bg":"gray.200"}},"negative":{"xl":{"bg":"red.200"}},"positive":{"xl":{"bg":"green.200"}}},"tone_xxl":{"neutral":{"xxl":{"bg":"gray.200"}},"negative":{"xxl":{"bg":"red.200"}},"positive":{"xxl":{"bg":"green.200"}}}},
            }
          });
          "
    `);
  });

  it('parses without style object', () => {
    const res = makeParser(`
    import { css, crv, cva } from '@/styled-system/css';

    const styles = cva({
      base: {
        // background: crv('size', { foo: { bg: 'red' }}),
      },
      variants: {
        ...crv('tone'),
      }
    });
    `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, crv, cva } from '@/styled-system/css';

          const styles = cva({
            base: {
              // background: crv('size', { foo: { bg: 'red' }}),
            },
            variants: {
              ...{"tone":{},"tone_sm":{},"tone_md":{},"tone_lg":{},"tone_xl":{},"tone_xxl":{}},
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
            ...crv('', {}),
          }
        });
      `),
    ).toMatchInlineSnapshot(`
      "import { crv, cva } from '@/styled-system/css';

              const styles = cva({
                variants: {
                  ...crv('', {}),
                }
              });
            "
    `);
  });
});
