import { parser } from '../parser';
import { context } from './fixtures';

export const makeParser = (content: string) => {
  return parser(
    {
      configure: () => {},
      filePath: 'test.tsx',
      content,
    },
    context,
  );
};

describe('parser', () => {
  it('parses', () => {
    const res = makeParser(`
    import foo from 'bar';
    import { css, crv, cva } from '@/styled-system/css';

    const styles = cva({
      base: {
        // background: crv('nope'),
      },
      variants: {
        ...crv('tone', {
          negative: { bg: "red.200" },
          "positive": { bg: "green.200" }
        }),
      },
    });

    export const Component = () => {
      return (<div className={}
      />);
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
              ...{"tone":{"negative":{"bg":"red.200"},"positive":{"bg":"green.200"}},"tone_sm":{"negative":{"sm":{"bg":"red.200"}},"positive":{"sm":{"bg":"green.200"}}},"tone_md":{"negative":{"md":{"bg":"red.200"}},"positive":{"md":{"bg":"green.200"}}},"tone_lg":{"negative":{"lg":{"bg":"red.200"}},"positive":{"lg":{"bg":"green.200"}}},"tone_xl":{"negative":{"xl":{"bg":"red.200"}},"positive":{"xl":{"bg":"green.200"}}},"tone_xxl":{"negative":{"xxl":{"bg":"red.200"}},"positive":{"xxl":{"bg":"green.200"}}}},
            },
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
