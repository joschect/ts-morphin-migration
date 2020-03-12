
import {
  SourceFile
} from "ts-morph";
import { utilities } from "../utilities";

const searchString=/^office\-ui\-fabric\-react/;
const newString = '@fluentui/react';

export function RepathOufrImports(file: SourceFile) {
  let imports = utilities.getImportByPath(file, searchString);
  imports.forEach(val => {
    utilities.repathImport(val, newString, searchString);
  })
}