import { Project } from "ts-morph";
import { CommandParser } from "./command";
import {utilities} from "./utilities/utilities";
import {RepathOufrImports} from './mods/RenameImport';

const command = new CommandParser().parseArgs(process.argv);
if (command.shouldExit) {
  process.exit(1);
}

const project = new Project();
project.addSourceFilesAtPaths(`${process.cwd()}/${command.path}/**/*.tsx`);
const files = project.getSourceFiles();

utilities.applyCodeMods(files, RepathOufrImports);
project.save();
