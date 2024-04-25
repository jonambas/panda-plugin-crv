import { ccv } from '../ccv';
import { breakpoints } from './fixtures';

describe('ccv', () => {
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
});
