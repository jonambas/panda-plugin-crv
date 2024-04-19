import type {
  CodegenPrepareHookArgs,
  MaybeAsyncReturn,
  Artifact,
  ArtifactContent,
} from '@pandacss/types';

import type { PluginContext } from './types';
import { crvFunc, crvFuncDts } from './crv';

export const codegen = (
  args: CodegenPrepareHookArgs,
  context: PluginContext,
): MaybeAsyncReturn<void | Artifact[]> => {
  const cssFn = args.artifacts.find((a) => a.id === 'css-fn');
  const index = args.artifacts.find((a) => a.id === 'css-index');
  const indexFile = index?.files.find((f) => f.file.match(/^index\.(mjs|js)/));
  const indexDtsFile = index?.files.find((f) => f.file.includes('index.d.'));
  const ext = indexFile?.file.split('.').at(-1);
  const dtsExt = indexDtsFile?.file.split('.').at(-1);

  if (!cssFn || !indexFile || !indexDtsFile) return args.artifacts;

  const crvFile: ArtifactContent = {
    file: `crv.${ext}`,
    code: crvFunc(context.breakpoints),
  };

  const crvDtsFile: ArtifactContent = {
    file: `crv.d.${dtsExt}`,
    code: crvFuncDts(context.breakpoints),
  };

  cssFn.files.push(crvFile, crvDtsFile);
  indexFile.code += `\nexport * from './crv.${ext}';`;
  indexDtsFile.code += `\nexport * from './crv';`;

  if (context.debug) {
    context.debug('plugin:crv', 'codegen complete');
  }

  return args.artifacts;
};
