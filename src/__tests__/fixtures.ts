import { createContext } from '../context';

export const breakpoints = {
  sm: '640px',
  md: '768px',
  '2lg': '1024px',
};

const ctx = createContext();
ctx.debug = vi.fn();
ctx.breakpoints = Object.keys(breakpoints);

export const context = ctx;
