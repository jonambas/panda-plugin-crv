import * as fs from 'fs';
import cac from 'cac';
import cp from 'child_process';
import { resolve } from 'path';
import { scenarios } from './scenarios';

const apps = ['vite-react', 'next-app', 'next-pages'];

type GenArgs = {
  dir: string;
  scenario: keyof typeof scenarios;
};

function config(args: GenArgs): void {
  const path = resolve(`./${args.dir}/panda.config.ts`);

  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }

  fs.writeFileSync(path, scenarios[args.scenario]);
  console.log(`${args.dir}: panda.config.ts created`);
}

function codegen(args: Pick<GenArgs, 'dir'>): void {
  const path = resolve(`./${args.dir}/`);
  try {
    cp.execSync(`npm run prepare`, {
      cwd: path,
      stdio: 'ignore',
    });
    console.log(`${args.dir}: panda codegen complete`);
  } catch (error) {
    console.error(`${args.dir}: panda codegen failed`);
  }
}

const cli = cac();

cli
  .command('gen')
  .option('-s <scenario>', 'Choose a scenario', {
    default: 'base',
    type: ['string'],
  })
  .action(async (options) => {
    for (const app of apps) {
      config({ dir: `/apps/${app}`, scenario: options.s });
      codegen({ dir: `/apps/${app}` });
    }
  });

cli.parse();
