import {execSync} from 'child_process';
import {
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'fs';
import glob from 'glob';
import path from 'path';

const toStr = v => JSON.stringify(v, null, 4);

const DEBUG = false;

export function esbuildServerSideJs({
  debug = DEBUG,
  projectDir = './',
  srcDir = `${projectDir}src/main/resources`,
  dstDir = `${projectDir}build/resources/main`,
  dstEsbuildDir = `${projectDir}build/esbuild`,
  assetsPathGlobBrace = '{site/assets,assets}',
  jsExtensionGlobBrace = '*.{es,es6,mjs,jsx,flow,js}',
  allJsAssetsGlob = `${srcDir}/${assetsPathGlobBrace}/**/${jsExtensionGlobBrace}`,
  allJsAssetsFiles = glob.sync(allJsAssetsGlob),
  shims = [],
  ignoreFiles = allJsAssetsFiles.concat(shims),
  serverJsFiles = glob.sync(`${srcDir}/**/${jsExtensionGlobBrace}`, {
  	ignore: ignoreFiles
  }),
  externals = [
    '/lib/http-client',
    '/lib/openxp/file-system',
    '/lib/util',
    '/lib/util/data',
    '/lib/xp/admin',
    '/lib/xp/auth',
    '/lib/xp/common',
    '/lib/xp/context',
    '/lib/xp/io',
    '/lib/xp/node',
    '/lib/xp/portal',
    '/lib/xp/repo',
    '/lib/xp/task',
    '/lib/xp/value'
  ]
} = {}) {
  if (debug) {
    console.log(`srcDir:${toStr(srcDir)}`);
    console.log(`dstDir:${toStr(dstDir)}`);
    console.log(`dstEsbuildDir:${toStr(dstEsbuildDir)}`);
    console.log(`assetsPathGlobBrace:${toStr(assetsPathGlobBrace)}`);
    console.log(`jsExtensionGlobBrace:${toStr(jsExtensionGlobBrace)}`);
    console.log(`allJsAssetsGlob:${toStr(allJsAssetsGlob)}`);
    console.log(`allJsAssetsFiles:${toStr(allJsAssetsFiles)}`);
    console.log(`shims:${toStr(shims)}`);
    console.log(`ignoreFiles:${toStr(ignoreFiles)}`);
    console.log(`serverJsFiles:${toStr(serverJsFiles)}`);
    console.log(`externals:${toStr(externals)}`);
  }
  const COMMAND_ARGS = [
    'npx',
    'esbuild',
    '--bundle',
    '--format=cjs',
    '--loader:.es=ts',
    //'--minify'
    `--outdir=${dstEsbuildDir}`,
    '--platform=browser',
    '--strict', // Allow code bloat to support obscure edge case
    '--target=es2015'
  ];
  const COMMAND = COMMAND_ARGS.join(' ');
  let stdout = '';
  stdout += execSync(COMMAND + ' ' + serverJsFiles.join(' '));
  if (stdout) {
    console.log(stdout);
  }
  const ESBUILT_FILES = glob.sync(`${dstEsbuildDir}/**/*.js`);
  ESBUILT_FILES.forEach((ESBUILT_FILE) => {
    debug && console.log(`ESBUILT_FILE:${toStr(ESBUILT_FILE)}`);
    const REL_PATH = ESBUILT_FILE.replace(dstEsbuildDir, dstDir);
    debug && console.log(`REL_PATH:${toStr(REL_PATH)}`);
    const DIRNAME = path.dirname(REL_PATH);
    debug && console.log(`DIRNAME:${toStr(DIRNAME)}`);
    mkdirSync(DIRNAME, { recursive: true });
    var output = [...shims, ESBUILT_FILE].map((f) => {
      debug && console.log(`f:${toStr(f)}`);
      return readFileSync(f).toString();
    }).join('');
    writeFileSync(REL_PATH, output);
  });
} // function esbuildServerSideJs
