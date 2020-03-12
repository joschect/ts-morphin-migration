import {
  SourceFile,
  SyntaxKind,
  JsxOpeningElement,
  JsxSelfClosingElement,
  ImportDeclaration
} from "ts-morph";

function findJsxTag(files: SourceFile[], tag: string) {
  let instances: (JsxOpeningElement | JsxSelfClosingElement)[] = [];
  files.forEach(file => {
    instances.concat(findJsxTagInFile(file, tag));
  });
}

function findJsxTagInFile(file: SourceFile, tag: string) {
  let instances: (JsxOpeningElement | JsxSelfClosingElement)[] = [];
    file.forEachDescendant( val => {
    switch (val.getKind()) {
      case SyntaxKind.JsxOpeningElement:
      case SyntaxKind.JsxSelfClosingElement: {

        if (
          (val as JsxOpeningElement | JsxSelfClosingElement).getTagNameNode().getText() === tag
        ) {
        instances.push(val as JsxSelfClosingElement | JsxOpeningElement);
        }
      }
    }
    });
    return instances
}

function renameImport(file: SourceFile, originalImport: string, renamedImport: string){ 
    const imps = file.getImportDeclarations().filter(cond => {
      return cond.getNamedImports().some(val => {
        return val.getText() === originalImport;
      });
    });
    imps[0].getNamedImports().forEach(name => {
      if(name.getText()=== originalImport) {
        name.renameAlias(renamedImport);
        name.remove();
      }
    })
    imps[0].addNamedImport(renamedImport);
}

/**
 * 
 * @param file File to search through
 * @param pathOrRegex If a string is given, it will do an exact match, otherwise it will use regex
 */
function getImportsByPath(file: SourceFile, pathOrRegex: string | RegExp): ImportDeclaration[] {
  let imps: ImportDeclaration[] =[];
  try {
    if (typeof pathOrRegex === "string") {
      imps = file.getImportDeclarations().filter(cond => {
        return cond.getModuleSpecifierValue() === pathOrRegex;
      });
    } else {
      imps = file.getImportDeclarations().filter(cond => {
        return pathOrRegex.test(cond.getModuleSpecifierValue());
      });
    }
  } catch(e) {
    throw e;
  }

  return imps;
}

function repathImport(imp: ImportDeclaration, replacementString: string, regex?: RegExp) {
  if(regex) {
    const current = imp.getModuleSpecifierValue();
    imp.setModuleSpecifier(current.replace(regex, replacementString))
  } else {
    imp.setModuleSpecifier(replacementString);
  }
}

function applyCodeMods(files: SourceFile[], mod: (file: SourceFile) => void) {
  files.forEach(mod);
  void 0;
}

// function rename

export const utilities = {
  findJsxTag,
  findJsxTagInFile,
  renameImport,
  repathImport,
  applyCodeMods,
  getImportByPath: getImportsByPath
};
