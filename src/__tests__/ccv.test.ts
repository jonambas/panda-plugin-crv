import { crvFunc } from '../crv';
import { breakpoints } from './fixtures';
import * as fs from 'node:fs';

fs.writeFileSync('_test-ccvFunc.mts', crvFunc(Object.keys(breakpoints)));

const {
  ccv,
  // @ts-ignore
} = await import('_test-ccvFunc.mts');

describe('crv codegen', () => {
  afterAll(() => {
    fs.unlinkSync('_test-ccvFunc.mts');
  });

  it('returns the expected variants', () => {
    const result = ccv({
      variant1: 'red',
      variant2: 'blue',
      css: { bg: 'green' },
    });

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
            "sm": {
              "bg": "green",
            },
          },
          "variant1_sm": "red",
          "variant2_sm": "blue",
        },
        {
          "css": {
            "md": {
              "bg": "green",
            },
          },
          "variant1_md": "red",
          "variant2_md": "blue",
        },
        {
          "css": {
            "2lg": {
              "bg": "green",
            },
          },
          "variant1_2lg": "red",
          "variant2_2lg": "blue",
        },
      ]
    `);
  });

  it('handles no variants', () => {
    const result = ccv({ bg: 'green' });

    expect(result).toEqual([]);
  });

  it('handles no styles', () => {
    const result = ccv({
      variant1: 'red',
      variant2: 'blue',
    });
    expect(result).toEqual([]);
  });
});
