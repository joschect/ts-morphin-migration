
import {
  SourceFile,
  SyntaxKind,
  JsxOpeningElement,
  JsxSelfClosingElement,
} from "ts-morph";

export function findJsxTag(files: SourceFile[], tag: string) {
  let instances: (JsxOpeningElement | JsxSelfClosingElement)[] = [];
  files.forEach(file => {
    instances.concat(findJsxTagInFile(file, tag));
  });
}

export function findJsxTagInFile(file: SourceFile, ...tags: string[]) {
  let instances: (JsxOpeningElement | JsxSelfClosingElement)[] = [];
    file.forEachDescendant( val => {
    switch (val.getKind()) {
      case SyntaxKind.JsxOpeningElement:
      case SyntaxKind.JsxSelfClosingElement: {

        if (
          tags.includes((val as JsxOpeningElement | JsxSelfClosingElement).getTagNameNode().getText())
        ) {
        instances.push(val as JsxSelfClosingElement | JsxOpeningElement);
        }
      }
    }
    });
    return instances
}