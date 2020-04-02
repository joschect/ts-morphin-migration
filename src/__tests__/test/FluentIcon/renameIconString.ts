import {
  Project
} from "ts-morph";
import { convertIconProp, convertIconInShorthandProp } from "../../../mods/FluentIconMod";
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
    convertIconProp(file);
    let elements = utilities.findJsxTagInFile(file, "Button");

    elements.forEach((imp, idx) => {
      if(idx == 0) {
        expect((imp.getAttribute("icon")?.getStructure() as any).initializer).toEqual('{<SomeStringIcon />}');
      }
      if(idx == 1) {
        expect((imp.getAttribute("icon")?.getStructure() as any).initializer).toEqual('{<PlayIcon {...{outline: true }} />}');
      }
      if(idx == 2) {
        expect((imp.getAttribute("icon")?.getStructure() as any).initializer).toEqual('{<PowerPointIcon {...{outline: true }} />}');
      }
    });
  });

  it("replace button group's button icon string with component", () => {
    const file = project.getSourceFileOrThrow("buttonGroupIcon.tsx");
    convertIconInShorthandProp(file);
    let elements = utilities.findJsxTagInFile(file, "ButtonGroup");

    elements.forEach((imp, idx) => {
      // if(idx == 0) {
      //   expect((imp.getAttribute("buttons")?.getStructure() as any).initializer).toEqual('{<SomeStringIcon />}');
      // }
      // TODO: add test
      // if(idx == 1) {
      //   expect((imp.getAttribute("buttons")?.getStructure() as any).initializer).toEqual('{<SomeStringIcon />}');
      // }
      // if(idx == 0) {
      //   expect((imp.getAttribute("buttons")?.getStructure() as any).initializer).toEqual('{<SomeStringIcon />}');
      // }
    });
  });
});
