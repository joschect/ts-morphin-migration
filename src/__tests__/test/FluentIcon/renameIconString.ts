import {
  Project
} from "ts-morph";
import { renameIconString } from "../../../mods/FluentIconMod";
import { utilities } from "../../../utilities/utilities";
const buttonPAth = "/**/__tests__/mock/**/FluentIcons/**/*.tsx";

describe("Can rename icon to icon component", () => {
  let project: Project;

  beforeEach(() => {
    project = new Project();
    project.addSourceFilesAtPaths(`${process.cwd()}${buttonPAth}`);
  });

  it("replace button icon string with component", () => {
    const file = project.getSourceFileOrThrow("buttonIcon.tsx");
    renameIconString(file);
    let elements = utilities.findJsxTagInFile(file, "Button");

    elements.forEach((imp, idx) => {
      if(idx == 0) {
        expect((imp.getAttribute("icon")?.getStructure() as any).initializer).toEqual('{<SomeString />}');
      }
      if(idx == 1) {
        expect((imp.getAttribute("icon")?.getStructure() as any).initializer).toEqual('{<Play {...{outline: true }} />}');
      }
    });
  });
});
