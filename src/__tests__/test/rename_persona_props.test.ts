
import {
  Project,
  SyntaxKind,
  InterfaceDeclaration,
  TypeReferenceNode,
  PropertyAccessExpression,
  JsxAttributeStructure
} from "ts-morph";
import {
    RenameRenderPersonaCoin,
    RenamePrimaryTextProp,
    RenameRenderCoin
} from "../../mods/PersonaToAvatarMod";
import { utilities } from "../../utilities";
const personaPath = "/**/__tests__/mock/**/persona/**/*.tsx";

describe("Rename Persona Props test", () => {
  let project: Project;

  beforeEach(() => {
    project = new Project();
    project.addSourceFilesAtPaths(`${process.cwd()}${personaPath}`);
  });

  it("can replace jsx inline primaryText prop", () => {
    const file = project.getSourceFileOrThrow("m_deprecated_props.tsx");
    RenamePrimaryTextProp(file);
    const elements = utilities.findJsxTagInFile(file, "Persona");
    elements.forEach(val => {
      expect(val.getAttribute("primaryText")).not.toBeTruthy();
    })
  });

  it("can replace jsx inline primaryText without changing the value", () => {
    const file = project.getSourceFileOrThrow("m_deprecated_props.tsx");
    const values = utilities.findJsxTagInFile(file, "Persona");
    const attValues = values.map(val => {
      return (((val.getAttribute("primaryText")?.getStructure()) as JsxAttributeStructure)?.initializer)
    })
    RenamePrimaryTextProp(file);
    const elements = utilities.findJsxTagInFile(file, "Persona");
    console.log(attValues);
    elements.forEach((val, index) => {
      expect(((val.getAttribute("text")?.getStructure()) as JsxAttributeStructure)?.initializer).toEqual(attValues[index]);
    })
  });
});