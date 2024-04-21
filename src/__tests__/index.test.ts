import { Mock, MockInstance } from 'vitest';
import * as module from '..';
import { codegen } from '../codegen';
import { parser } from '../parser';

vi.mock('../codegen');
vi.mock('../parser');

const { pluginResponsiveVariants } = module;

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

  it('ca;;s parser', () => {
    const parse = pluginResponsiveVariants().hooks?.['parser:before']!;
    parse({ content: '', configure: vi.fn(), filePath: 'test.tsx' });
    expect(parser).toHaveBeenCalledTimes(1);
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
