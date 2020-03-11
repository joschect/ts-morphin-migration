
import {
  Project,
  SyntaxKind,
  InterfaceDeclaration,
  TypeReferenceNode,
  PropertyAccessExpression,
  JsxAttributeStructure,
  JsxSpreadAttribute
} from "ts-morph";
import {
    RenameRenderPersonaCoin,
    RenamePrimaryTextProp,
    RenameRenderCoin
} from "../../mods/PersonaToAvatarMod";
import { utilities } from "../../utilities";
const personaPath = "/**/__tests__/mock/**/persona/**/*.tsx";
// @TODO ensure that props are not renamed for non fabric personas if they exist

describe("Rename Persona Props test", () => {
  let project: Project;

  beforeEach(() => {
    project = new Project();
    project.addSourceFilesAtPaths(`${process.cwd()}${personaPath}`);
  });

  it("can replace jsx inline primaryText prop", () => {
    const file = project.getSourceFileOrThrow("mPersonaProps.tsx");
    RenamePrimaryTextProp(file);
    const elements = utilities.findJsxTagInFile(file, "Persona");
    elements.forEach(val => {
      expect(val.getAttribute("primaryText")).not.toBeTruthy();
    })
  });

  it("can replace jsx inline primaryText without changing the value", () => {
    const file = project.getSourceFileOrThrow("mPersonaProps.tsx");
    const values = utilities.findJsxTagInFile(file, "Persona");
    const attValues = values.map(val => {
      return (((val.getAttribute("primaryText")?.getStructure()) as JsxAttributeStructure)?.initializer)
    })
    RenamePrimaryTextProp(file);
    const elements = utilities.findJsxTagInFile(file, "Persona");
    elements.forEach((val, index) => {
      expect(((val.getAttribute("text")?.getStructure()) as JsxAttributeStructure)?.initializer).toEqual(attValues[index]);
    })
  });

  it("can replace jsx spread primaryText", () => {
    const file = project.getSourceFileOrThrow("mPersonaSpreadProps.tsx");
    RenamePrimaryTextProp(file);
    const els = utilities.findJsxTagInFile(file, "Persona");
    els.forEach(val => {
      val.getAttributes().forEach(att => {
        if(att.getKind() === SyntaxKind.JsxSpreadAttribute) {
          // This is really the best way to figure out if the spread property is expected to have the prop
          // that we care about. This won't catch all cases but for testing it's a good place to start.
          att.getFirstChildByKind(SyntaxKind.Identifier)?.getType().getProperties().forEach(prop =>  {
            expect(prop.getName()).not.toEqual("primaryText");
          });
        }
      })
    })
  });
});