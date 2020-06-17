import { ICodeMod } from '../codeMods/ICodeMod';
import {Glob} from 'glob';
import {SemVer, Range} from 'semver'

// TODO ensure that async for all these utilities works
export function runMods<T>(codeMods: ICodeMod<T>[], sources: T[]) {
  for(let file of sources) {
    // Run every mod on each file?
    // I like that
    for(let mod of codeMods) {
      mod.run(file);
    }
  }
}

export function getModsRootPath() {
  // This function will always be hosed just under the folder modRunner.
  return `${__dirname}/../codeMods/mods`;
}

export function getModsPattern(includeTs: boolean = false) {
  // For testing
  if(includeTs) {
    return '/**/*.@(js|ts)';
  }

  return '/**/*.js';
}

export function getModsPaths(root: string = getModsRootPath(), modsPath: string = getModsPattern()) {
  const glob = new Glob(modsPath, {
    absolute: false,
    root: root,
    sync: true
  });
  return glob.found;
}

export function getTsConfigs(root: string = process.cwd()) {
  const glob = new Glob('/**/tsconfig.json', {
    absolute: false,
    ignore: ['**/node_modules/**'],
    root: root,
    sync: true
  });

  return glob.found;
}

// TODO this is a great place for maybe, this pattern will probably be a bunch of places.
export function loadMod(path: string, errorCallback: (e: Error) => void): {success: boolean, mod?: ICodeMod} {

  try {
    let mod = require(path).default;
    return {success: true, mod};
  } catch (e) {
    errorCallback(e)
  }

  return {success: false}
}

export function filterMods(codeMods: ICodeMod<any>[], semvarRange: Range) {
  return codeMods.filter((mod)=> {
    return semvarRange.test(mod.version);
  })
}
