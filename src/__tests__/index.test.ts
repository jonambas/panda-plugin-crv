import { pluginResponsiveVariants } from '..';

describe('pluginResponsiveVariants', () => {
  it('returns a PandaPlugin', () => {
    expect(pluginResponsiveVariants).toBeTypeOf('function');
    expect(pluginResponsiveVariants().name).toBeDefined();
    expect(pluginResponsiveVariants().hooks).toBeDefined();
  });
});
