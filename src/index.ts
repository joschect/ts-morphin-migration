import { Project, SyntaxKind, JsxOpeningElement } from "ts-morph";
import { CommandParser } from "./command";

const command = new CommandParser().parseArgs(process.argv);
if (command.shouldExit) {
  process.exit(1);
}

const project = new Project();
project.addSourceFilesAtPaths(`${process.cwd()}/${command.path}/**/*.tsx`);
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
