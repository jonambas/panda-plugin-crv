import { IndentationText, Project, ts } from 'ts-morph';
import type { PluginContext } from './types';

export const createContext = (): PluginContext => ({
  project: new Project({
    compilerOptions: {
      jsx: ts.JsxEmit.React,
      jsxFactory: 'React.createElement',
      jsxFragmentFactory: 'React.Fragment',
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      noUnusedParameters: false,
      noEmit: true,
      useVirtualFileSystem: true,
      allowJs: true,
    },
    skipAddingFilesFromTsConfig: true,
    skipFileDependencyResolution: true,
    skipLoadingLibFiles: true,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
    },
  }),
  breakpoints: [],
});
