export const semanticTokens = {
  colors: {
    tone: {
      positive: { value: '{colors.green.500}' },
      negative: { value: '{colors.red.500}' },
    },
  },
};

export const componentTokens = {
  raw: { red: '#ff0000', blue: '#0000ff' },
  valueKey: {
    string: { value: '#9a9a9a' },
    object: { value: { base: '#000', lg: '#555', _hover: '#999' } },
  },
  semantic: { green: '{colors.tone.positive}', red: '{colors.tone.negative}' },
};
