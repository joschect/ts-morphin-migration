import { utilities } from "../../utilities/utilities";
import { Project, SourceFile } from "ts-morph";
import { JSXNames } from "../mock/mockFunction";

const project = new Project();
project.addSourceFilesAtPaths(`${process.cwd()}/**/__tests__/mock/**/*.tsx`);
const fileName = "mockFunction.tsx";

describe("utilities test", () => {
  it("can find a regular jsx tag", () => {
    const tag = utilities.findJsxTagInFile(
      project.getSourceFileOrThrow(fileName),
      JSXNames.JSXFunctionalNormalTag
    );
    expect(tag.length).toEqual(1);
  });

  it("can find a self closing jsx tag", () => {
    const tag = utilities.findJsxTagInFile(
      project.getSourceFileOrThrow(fileName),
      JSXNames.JSXFunctionalSelfClosingTag
    );
    expect(tag.length).toEqual(1);
  });

  it("can replace a tag", () => {
    const file = project.getSourceFileOrThrow(fileName);
    utilities.renameImport(file, "ToImport", "Renamed");
    expect(file.getText().indexOf("ToImport")).toBe(-1);
  });

  it("runs codemods on all files in a project", () => {
    const mockCodemod = (file: SourceFile) => {
      file.insertText(file.getEnd(), "123Modified123");
    };
    utilities.applyCodeMods(project.getSourceFiles(), mockCodemod);
    project.getSourceFiles().forEach(file => {
      expect(file.getText().indexOf("123Modified123")).toBeGreaterThan(-1);
    });
  });
});
