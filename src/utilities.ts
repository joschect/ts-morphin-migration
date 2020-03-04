import { SourceFile, SyntaxKind, JsxOpeningElement, JsxSelfClosingElement, Node } from "ts-morph";

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
    expect(imps.length).toEqual(1);
    imps[0].getNamedImports().forEach(name => {
      if(name.getText()=== originalImport) {
        name.renameAlias(renamedImport);
        name.remove();
      }
    })
    imps[0].addNamedImport(renamedImport);
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
  applyCodeMods
};
