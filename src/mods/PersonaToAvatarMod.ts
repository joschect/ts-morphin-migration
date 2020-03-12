import {
  SourceFile,
  JsxAttributeStructure,
  SyntaxKind,
  JsxSpreadAttribute,
  VariableDeclaration,
  VariableDeclarationList,
  VariableStatement,
  ParameterDeclaration,
  VariableDeclarationKind,
  ts,
  Node
} from "ts-morph";
import { utilities } from "../utilities";

const personaPath = "office-ui-fabric-react/lib/Persona";

export function AppendNamedImportIfNoExist(
  file: SourceFile,
  moduleSpecifier: string,
  namedImports: string[]
) {
  const found = file.getImportDeclaration(val => {
    if (val.getModuleSpecifierValue() === moduleSpecifier) {
      const currentNamedImports = val.getNamedImports();
      namedImports.forEach(str => {
        if (!currentNamedImports.some(cname => cname.getText() === str)) {
          val.addNamedImport(str);
        }
      });
      return true;
    }
    return false;
  });
  if (!found) {
    file.addImportDeclaration({
      moduleSpecifier,
      namedImports
    });
  }
}

export function ReplacePersonaImport(file: SourceFile) {
  let found = false;
  file.getImportDeclarations().forEach(imp => {
    if (imp.getModuleSpecifierValue() === personaPath) {
      imp.getNamedImports().forEach(val => {
        if (val.getText() === "Persona") {
          found = true;
          val.renameAlias("Avatar");
          val.remove();
        }
      });
    }
  });
  if (found) {
    AppendNamedImportIfNoExist(file, "office-ui-fabric-react/lib/Avatar", [
      "Avatar"
    ]);
  }
}

export function ReplaceIPersonaPropsImport(file: SourceFile) {
  // Figure out if I should actually make this change
  // TODO need to test with a variety of things, maybe one that serves as a passthrough
  let found = false;
  file.getImportDeclarations().forEach(imp => {
    if (imp.getModuleSpecifierValue() === personaPath) {
      imp.getNamedImports().forEach(val => {
        if (val.getText() === "IPersonaProps") {
          val.renameAlias("AvatarProps");
          val.remove();
          found = true;
        }
      });
    }
  });
  if (found) {
    AppendNamedImportIfNoExist(file, "office-ui-fabric-react/lib/Avatar", [
      "AvatarProps"
    ]);
  }
}

export function ReplacePersonaSizeImport(file: SourceFile) {
  let found = false;
  file.getImportDeclarations().forEach(imp => {
    if (imp.getModuleSpecifierValue() === personaPath) {
      imp.getNamedImports().forEach(val => {
        if (val.getText() === "PersonaSize") {
          found = true;
          val.renameAlias("AvatarSize");
          val.remove();
        }
      });
    }
  });
  if (found) {
    AppendNamedImportIfNoExist(file, "office-ui-fabric-react/lib/Avatar", [
      "AvatarSize"
    ]);
  }
}

// Gets the parent that is a direct descendant of a block
// Which should allow for better inserting
function getBlockContainer(node: Node<ts.Node>) {
  return node.getFirstAncestor(ans => {
    const ansPar = ans.getParent();
    return ansPar?.getKind() === SyntaxKind.Block;
  });
}

export function RenamePrimaryTextProp(file: SourceFile) {
  // Should this fix the naming if the Persona Component has already been renamed to Avatar
  const elements = utilities.findJsxTagInFile(file, "Persona");
  elements.forEach(val => {
    let att = val.getAttribute("primaryText");
    if (att) {
      att.set({ name: "text" });
    } else {
      const atts = val.getAttributes();
      atts.forEach(a => {
        if (a.getKind() === SyntaxKind.JsxSpreadAttribute) {
          const id = (a as JsxSpreadAttribute).getFirstChildByKind(
            SyntaxKind.Identifier
          );
          if (id) {
            // If the type of the property has the attribute that we are looking for, then do what needs to be done.
            if (
              id
                .getType()
                .getProperties()
                .some(typeVal => {
                  return typeVal.getName() === "primaryText";
                })
            ) {
              const def = id.getDefinitions();
              if (def.length === 1) {
                switch (def[0].getKind()) {
                  case ts.ScriptElementKind.constElement:
                  case ts.ScriptElementKind.letElement:
                  case ts.ScriptElementKind.variableElement: {
                    // We are explicitly looking for the declaration of this const, variable, or let
                    const node = def[0].getDeclarationNode();
                    if (
                      node &&
                      node.getKind() === SyntaxKind.VariableDeclaration
                    ) {
                      const tDef = node as VariableDeclaration;

                      const st = tDef.getStructure();
                      const par = tDef.getParent().getParent();
                      if (par.getKind() === SyntaxKind.VariableStatement) {
                        if (
                          !(par as VariableStatement).getFirstDescendant(
                            val => {
                              return (
                                val.getKind() === SyntaxKind.Identifier &&
                                val.getText() === "__migPersonaProps"
                              );
                            }
                          )
                        ) {
                          (par as VariableStatement).addDeclaration({
                            name: `{primaryText, ...__migPersonaProps}`,
                            initializer: st.name
                          });
                        }
                        id.replaceWithText("__migPersonaProps");
                        val.addAttribute({
                          name: "text",
                          initializer: "{primaryText}"
                        });
                      }
                    }
                    break;
                  }
                  case ts.ScriptElementKind.parameterElement: {
                    const tDef = def[0];
                    const bl = getBlockContainer(val);
                    const p = bl?.getParentIfKind(SyntaxKind.Block);
                    const insIndex = bl?.getChildIndex();
                    if (insIndex === undefined) {
                      throw "asdfasdf";
                    }

                    if (!p?.getVariableStatement("__migPersonaProps")) {
                      console.log("inserting");
                      p?.insertVariableStatement(insIndex, {
                        declarations: [
                          {
                            name: "{primaryText, ...__migPersonaProps}",
                            initializer: tDef.getName(),
                            type: VariableDeclarationKind.Const
                          }
                        ]
                      });
                    }

                    id.replaceWithText("__migPersonaProps");
                    val.addAttribute({
                      name: "text",
                      initializer: "{primaryText}"
                    });
                    break;
                  }
                }
              }
            }
          }
        }
      });
    }
  });
}
export function RenameRenderPersonaCoin(file: SourceFile) {}
export function RenameRenderCoin(file: SourceFile) {}
