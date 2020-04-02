import { Project } from "ts-morph";
import { CommandParser } from "./command";
import {utilities} from "./utilities/utilities";
// import {RepathOfficeToFluentImports} from './mods/OfficeToFluentImportMod';
import {convertIconProp, convertIconInShorthandProp} from './mods/FluentIconMod';

const command = new CommandParser().parseArgs(process.argv);
if (command.shouldExit) {
  process.exit(1);
}

const project = new Project();
project.addSourceFilesAtPaths(`${process.cwd()}/${command.path}/**/*.tsx`);
const files = project.getSourceFiles();

// utilities.applyCodeMods(files, RepathOfficeToFluentImports);
utilities.applyCodeMods(files, convertIconProp);
utilities.applyCodeMods(files, convertIconInShorthandProp);
project.save();
