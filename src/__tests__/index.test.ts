import type { Mock } from 'vitest';
import { pluginResponsiveVariants } from '..';
import { codegen } from '../codegen';
import { parsers } from '../parsers';

vi.mock('../codegen');
vi.mock('../parsers');

describe('pluginResponsiveVariants', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns a PandaPlugin', () => {
    expect(pluginResponsiveVariants).toBeTypeOf('function');
    expect(pluginResponsiveVariants().name).toBeDefined();
    expect(pluginResponsiveVariants().hooks).toBeDefined();
  });

  it('calls codgen', () => {
    const prepare = pluginResponsiveVariants().hooks?.['codegen:prepare']!;
    prepare({ artifacts: [], changed: [] });
    expect(codegen).toHaveBeenCalledTimes(1);
  });

  it('calls parser', () => {
    const parse = pluginResponsiveVariants().hooks?.['parser:before']!;
    parse({ content: '', configure: vi.fn(), filePath: 'test.tsx' });
    expect(parsers).toHaveBeenCalledTimes(1);
  });

  it('sets context', () => {
    const plugin = pluginResponsiveVariants();
    const context = plugin?.hooks?.['context:created']!;
    const prepare = plugin?.hooks?.['codegen:prepare']!;
    context({
      // @ts-ignore
      logger: { debug: vi.fn() },
      // @ts-ignore
      ctx: { config: { theme: { breakpoints: { sm: '', lg: '' } } } },
    });
    prepare({ artifacts: [], changed: [] });

    const ctx = (codegen as Mock).mock.calls[0][1];
    expect(ctx.debug).toBeTypeOf('function');
    expect(ctx.breakpoints).toEqual(['sm', 'lg']);
  });
});
