import { ccv } from '../ccv';
import { crvFunc } from '../crv';
import { breakpoints } from './fixtures';
import * as fs from 'node:fs';

fs.writeFileSync('_test-ccvFunc.mts', crvFunc(Object.keys(breakpoints)));

const {
  ccv: ccvCodegen,
  // @ts-ignore
} = await import('_test-ccvFunc.mts');

describe('ccv', () => {
  afterAll(() => {
    fs.unlinkSync('_test-ccvFunc.mts');
  });

  it('returns the expected compound variants', () => {
    const result = ccv(
      {
        variant1: 'red',
        variant2: 'blue',
      },
      { bg: 'green' },
      Object.keys(breakpoints),
    );

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "css": {
            "bg": "green",
          },
          "variant1": "red",
          "variant2": "blue",
        },
        {
          "css": {
            "bg": {
              "sm": "green",
            },
          },
          "variant1_sm": "red",
          "variant2_sm": "blue",
        },
        {
          "css": {
            "bg": {
              "md": "green",
            },
          },
          "variant1_md": "red",
          "variant2_md": "blue",
        },
        {
          "css": {
            "bg": {
              "lg": "green",
            },
          },
          "variant1_lg": "red",
          "variant2_lg": "blue",
        },
        {
          "css": {
            "bg": {
              "xl": "green",
            },
          },
          "variant1_xl": "red",
          "variant2_xl": "blue",
        },
        {
          "css": {
            "bg": {
              "xxl": "green",
            },
          },
          "variant1_xxl": "red",
          "variant2_xxl": "blue",
        },
      ]
    `);
  });

  it('handles no breakpoints', () => {
    const result = ccv(
      {
        variant1: 'red',
        variant2: 'blue',
      },
      { bg: 'green' },
      [],
    );

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "css": {
            "bg": "green",
          },
          "variant1": "red",
          "variant2": "blue",
        },
      ]
    `);
  });

  it('handles no variants', () => {
    const result = ccv({}, { bg: 'green' }, []);

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "css": {
            "bg": "green",
          },
        },
      ]
    `);
  });

  it('handles no styles', () => {
    const result = ccv(
      {
        variant1: 'red',
        variant2: 'blue',
      },
      // @ts-ignore
      null,
      Object.keys(breakpoints),
    );
    expect(result).toEqual([]);
  });
});

describe('crv codegen', () => {
  it('returns the expected variants', () => {
    const result = ccvCodegen(
      {
        variant1: 'red',
        variant2: 'blue',
      },
      { bg: 'green' },
    );

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "css": {
            "bg": "green",
          },
          "variant1": "red",
          "variant2": "blue",
        },
        {
          "css": {
            "bg": {
              "sm": "green",
            },
          },
          "variant1_sm": "red",
          "variant2_sm": "blue",
        },
        {
          "css": {
            "bg": {
              "md": "green",
            },
          },
          "variant1_md": "red",
          "variant2_md": "blue",
        },
        {
          "css": {
            "bg": {
              "lg": "green",
            },
          },
          "variant1_lg": "red",
          "variant2_lg": "blue",
        },
        {
          "css": {
            "bg": {
              "xl": "green",
            },
          },
          "variant1_xl": "red",
          "variant2_xl": "blue",
        },
        {
          "css": {
            "bg": {
              "xxl": "green",
            },
          },
          "variant1_xxl": "red",
          "variant2_xxl": "blue",
        },
      ]
    `);
  });

  it('handles no variants', () => {
    const result = ccvCodegen(
      // @ts-ignore
      null,
      { bg: 'green' },
    );

    expect(result).toEqual([]);
  });

  it('handles no styles', () => {
    const result = ccvCodegen(
      {
        variant1: 'red',
        variant2: 'blue',
      },
      // @ts-ignore
      null,
    );
    expect(result).toEqual([]);
  });
});
