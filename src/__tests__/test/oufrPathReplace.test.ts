import { Project } from "ts-morph";
import { RepathOufrImports } from "../../mods/RenameImport";

const fileName = "mockImports.tsx";
const newRoot = "@fluentui/react";
const oldRoot = "office-ui-fabric-react";
describe("Import Utilities test", () => {
  let project: Project;

  beforeEach(() => {
    project = new Project();
    project.addSourceFilesAtPaths(
      `${process.cwd()}/**/__tests__/mock/utils/*.tsx`
    );
  });

  it("Can remove all old paths in one file", () => {
    const file = project.getSourceFileOrThrow(fileName);
    RepathOufrImports(file);

    file.getImportStringLiterals().forEach(val => {
      const impPath = val.getLiteralValue();
      expect(impPath.indexOf(oldRoot)).toEqual(-1);
    });
  });

  it("Can replace all old paths in one with the new root", () => {
    const file = project.getSourceFileOrThrow(fileName);
    const oldImportList = file.getImportStringLiterals().map(val => {
      return val.getLiteralValue();
    });

    RepathOufrImports(file);
    const newImpList = file.getImportStringLiterals();
    expect(
      newImpList.some(val => val.getLiteralValue().indexOf(newRoot) > -1)
    ).toBe(true);
    newImpList.forEach((val, index) => {
      if (oldImportList[index] === oldRoot) {
        expect(val.getLiteralValue().indexOf(newRoot)).toBe(0);
      }
    });
  });
});