import { createContext } from '../context';

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
};

const ctx = createContext();
ctx.debug = vi.fn();
ctx.breakpoints = Object.keys(breakpoints);

export const context = ctx;
