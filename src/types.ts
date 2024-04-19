import type { LoggerInterface } from '@pandacss/types';
import type { Project } from 'ts-morph';

export type PluginContext = {
  project: Project;
  debug?: LoggerInterface['debug'];
  breakpoints: string[];
};
