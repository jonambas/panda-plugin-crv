import { crv, crvFunc } from '../crv';
import { breakpoints } from './fixtures';
import * as fs from 'node:fs';

fs.writeFileSync('_test-crvFunc.mts', crvFunc(Object.keys(breakpoints)));

const {
  splitCrv,
  crv: crvCodegen,
  splitResponsiveVariant,
  // @ts-ignore
} = await import('_test-crvFunc.mts');

describe('crv', () => {
  afterAll(() => {
    fs.unlinkSync('_test-crvFunc.mts');
  });

  it('returns the expected variants', () => {
    const result = crv(
      'prop',
      { variant1: { color: 'red' }, variant2: { color: 'blue' } },
      Object.keys(breakpoints),
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "prop": {
          "variant1": {
            "color": "red",
          },
          "variant2": {
            "color": "blue",
          },
        },
        "prop_lg": {
          "variant1": {
            "lg": {
              "color": "red",
            },
          },
          "variant2": {
            "lg": {
              "color": "blue",
            },
          },
        },
        "prop_md": {
          "variant1": {
            "md": {
              "color": "red",
            },
          },
          "variant2": {
            "md": {
              "color": "blue",
            },
          },
        },
        "prop_sm": {
          "variant1": {
            "sm": {
              "color": "red",
            },
          },
          "variant2": {
            "sm": {
              "color": "blue",
            },
          },
        },
        "prop_xl": {
          "variant1": {
            "xl": {
              "color": "red",
            },
          },
          "variant2": {
            "xl": {
              "color": "blue",
            },
          },
        },
        "prop_xxl": {
          "variant1": {
            "xxl": {
              "color": "red",
            },
          },
          "variant2": {
            "xxl": {
              "color": "blue",
            },
          },
        },
      }
    `);
  });

  it('handles no breakpoints', () => {
    const result = crv(
      'prop',
      { true: { color: 'red' }, false: { color: 'blue' } },
      [],
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "prop": {
          "false": {
            "color": "blue",
          },
          "true": {
            "color": "red",
          },
        },
      }
    `);
  });

  it('handles no variants', () => {
    const result = crv('prop', {}, Object.keys(breakpoints));

    expect(result).toMatchInlineSnapshot(`
      {
        "prop": {},
        "prop_lg": {},
        "prop_md": {},
        "prop_sm": {},
        "prop_xl": {},
        "prop_xxl": {},
      }
    `);
  });

  it('handles no prop', () => {
    const result = crv('', {}, Object.keys(breakpoints));
    expect(result).toBeUndefined();
  });
});

describe('crv codegen', () => {
  it('returns the expected variants', () => {
    const result = crvCodegen('prop', {
      variant1: { color: 'red' },
      variant2: { color: 'blue' },
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "prop": {
          "variant1": {
            "color": "red",
          },
          "variant2": {
            "color": "blue",
          },
        },
        "prop_lg": {
          "variant1": {
            "lg": {
              "color": "red",
            },
          },
          "variant2": {
            "lg": {
              "color": "blue",
            },
          },
        },
        "prop_md": {
          "variant1": {
            "md": {
              "color": "red",
            },
          },
          "variant2": {
            "md": {
              "color": "blue",
            },
          },
        },
        "prop_sm": {
          "variant1": {
            "sm": {
              "color": "red",
            },
          },
          "variant2": {
            "sm": {
              "color": "blue",
            },
          },
        },
        "prop_xl": {
          "variant1": {
            "xl": {
              "color": "red",
            },
          },
          "variant2": {
            "xl": {
              "color": "blue",
            },
          },
        },
        "prop_xxl": {
          "variant1": {
            "xxl": {
              "color": "red",
            },
          },
          "variant2": {
            "xxl": {
              "color": "blue",
            },
          },
        },
      }
    `);
  });

  it('handles no variants', () => {
    const result = crvCodegen('prop', {});

    expect(result).toMatchInlineSnapshot(`
      {
        "prop": {},
        "prop_lg": {},
        "prop_md": {},
        "prop_sm": {},
        "prop_xl": {},
        "prop_xxl": {},
      }
    `);
  });

  it('handles no prop', () => {
    const result = crvCodegen('', {});
    expect(result).toBeUndefined();
  });
});

describe('splitCrv codegen', () => {
  it('is an alias for splitResponsiveVariant', () => {
    expect(splitResponsiveVariant).toBe(splitCrv);
  });

  it('handles non-reponsive values', async () => {
    expect(splitCrv('prop', 'variant')).toEqual({ prop: 'variant' });
    expect(splitCrv('prop', false)).toEqual({ prop: false });
  });

  it('splits the crv', async () => {
    const result = splitCrv('prop', {
      base: 'variant1',
      sm: 'variant2',
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "prop": "variant1",
        "prop_sm": "variant2",
      }
    `);
  });

  it('handles invalid prop keys', async () => {
    const result = splitCrv('prop', {
      base: 'variant1',
      notMe: 'variant2',
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "prop": "variant1",
      }
    `);
  });

  it('handles falsey values', async () => {
    const result = splitCrv('prop', {
      base: null,
      lg: false,
      md: '',
      xl: undefined,
      xxl: 0,
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "prop": null,
        "prop_lg": false,
        "prop_md": "",
        "prop_xl": undefined,
        "prop_xxl": 0,
      }
    `);
  });
});
