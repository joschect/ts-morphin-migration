import { Project, SyntaxKind, JsxOpeningElement } from "ts-morph";

const args = process.argv[2];

const project = new Project();
project.addSourceFilesAtPaths(`${process.cwd()}/${args}/**/*.tsx`);
const files = project.getSourceFiles();
console.log(files.length);
files.forEach(file => {
  file.forEachDescendant(val => {
    switch (val.getKind()) {
      case SyntaxKind.JsxOpeningElement:
      case SyntaxKind.JsxSelfClosingElement: {
        console.log("yayaayyy");
        if (
          (val as JsxOpeningElement).getTagNameNode().getText() === "ComboBox"
        ) {
          console.log("bad bad bad");
        }
      }
    }
    
  });
});


console.log(`${process.cwd()}/${args}/**/*.tsx`);

