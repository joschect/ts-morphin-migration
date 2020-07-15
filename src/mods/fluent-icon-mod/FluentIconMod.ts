import {
  ArrayLiteralExpression, Identifier,
  JsxAttribute,
  JsxExpression, JsxSelfClosingElement,
  ObjectLiteralExpression,
  SourceFile,
  StructureKind,
  SyntaxKind,
  StringLiteral
} from "ts-morph";
import {utilities} from "../../utilities/utilities";
import inconsistentIconNames from './inconsistentIconNames'
import componentsWithIcon from "./componentsWithIcon";
import componentsWithCollectionContainingIcon, {mapComponentToCollectionPropName} from "./componentsWithCollectionContainingIcon";

const convertNameToIconComponentName = (iconName: string) => {
  if (inconsistentIconNames[iconName]) return inconsistentIconNames[iconName];
  let componentName = "";
  let convertToUpperCase = true;
  for (let i = 0; i < iconName.length; i++) {
    if (iconName[i] !== '-') {
      if (convertToUpperCase) {
        convertToUpperCase = false;
        componentName += iconName[i].toUpperCase();
      } else {
        componentName += iconName[i];
      }
    } else {
      convertToUpperCase = true;
    }
  }

  return componentName + "Icon";
};

const addFilteredIconNames = (iconNames: string[], file: SourceFile) => {
  // remove duplicates
  const filteredIconNames = iconNames.filter((name, idx) => iconNames.indexOf(name) === idx);

  if (filteredIconNames.length > 0) {
    file.addImportDeclaration({
      namedImports: filteredIconNames,
      moduleSpecifier: '@msteams/components-fluent-ui-icons'
    });
  }
};

const isValidIconName = (iconName: string) => iconName && iconName.length > 0 && iconName.indexOf(" ") < 0;

const updateIconComponentFromStringLiteral = (stringLiteral: StringLiteral, iconNames: string[], tAtt: JsxAttribute) => {
  const iconName = stringLiteral.getLiteralValue();
  if (isValidIconName(iconName)) {
    let ComponentName = convertNameToIconComponentName(iconName);
    iconNames.push(ComponentName);

    tAtt.setInitializer(`{<${ComponentName} />}`);
  } else {
    // file.insertText(0, "// TODO: There is an icon name that was not resolved \n");
  }
};

// <Button icon={'some-string'}/>] =  <Button icon={<SomeString/>}/>
export function convertIconProp(file: SourceFile) {

  const elements = utilities.findJsxTagInFile(file, ...componentsWithIcon);

  // list that contains all newly added Icon components
  const iconNames: string[] = [];

  console.log("Processing file " + file.getBaseName());

  elements.forEach(val => {
    const att = val.getAttribute('icon');
    if (!!att) {
      if (att!.getKind() !== SyntaxKind.JsxSpreadAttribute) {
        const tAtt = att! as JsxAttribute;

        const exp = tAtt.getChildrenOfKind(SyntaxKind.JsxExpression)[0];

        if (!!exp) {
          // Icon as string
          const stringLiteral = exp.getChildrenOfKind(SyntaxKind.StringLiteral)[0];

          if (!!stringLiteral) {
            updateIconComponentFromStringLiteral(stringLiteral, iconNames, tAtt);
          } else {

            // Icon as object
            const objectLiteral = exp.getChildrenOfKind(SyntaxKind.ObjectLiteralExpression)[0];

            if (!!objectLiteral) {
              let iconName = "";

              const name = objectLiteral.getProperty('name');

              if (!!name) {
                // save the name
                const stringLiteral = name.getChildrenOfKind(SyntaxKind.StringLiteral)[0];

                if (stringLiteral) {
                  iconName = stringLiteral.getLiteralValue();
                }
              }

              if (isValidIconName(iconName)) {
                let ComponentName = convertNameToIconComponentName(iconName);

                iconNames.push(ComponentName);

                // remove it from the object literal
                (name as any).remove();

                // update initializer
                let initializer = "";
                initializer += `{<${ComponentName} {...`;
                initializer += objectLiteral.getText();
                initializer += '} />}';
                tAtt.setInitializer(initializer);
              } else {
                // file.insertText(0, "// TODO: There is an icon name that was not resolved \n");
              }
            }
          }

        } else {
          // Icon as string
          const stringLiteral = tAtt.getChildrenOfKind(SyntaxKind.StringLiteral)[0];

          if (!!stringLiteral) {
            updateIconComponentFromStringLiteral(stringLiteral, iconNames, tAtt);
          }
        }
      } else {
        // file.insertText(0, "// TODO: Spreading props on a component that contains icon prop \n");
      }
    }
  });

  addFilteredIconNames(iconNames, file);
}

// <ButtonGroup buttons={[{icon: 'some-string'}]} />] =  <Button buttons={[{icon: <SomeString/>}]}/>
export function convertIconInShorthandProp(file: SourceFile) {

  const elements = utilities.findJsxTagInFile(file, ...componentsWithCollectionContainingIcon);

  // list that contains all newly added Icon components
  const iconNames: string[] = [];

  console.log("Processing file " + file.getBaseName());

  elements.forEach(val => {
    const tag = (val as any).getStructure().name;
    const att = val.getAttribute(mapComponentToCollectionPropName[tag]);
    if (!!att) {
      if (att!.getKind() !== SyntaxKind.JsxSpreadAttribute) {
        const tAttr = att as JsxAttribute;
        if (!!tAttr) {
          const expressions = tAttr.getChildrenOfKind(SyntaxKind.JsxExpression) as JsxExpression[];
          if (!!expressions && expressions.length > 0) {
            const jsxExp = expressions[0];

            let arrayExpressions = null;
            const identifier = jsxExp.getChildrenOfKind(SyntaxKind.Identifier)[0] as Identifier;
            if (!!identifier) {
              const declarationNode = identifier.getDefinitions()[0].getDeclarationNode();
              if (declarationNode) {
                arrayExpressions = declarationNode.getChildrenOfKind(SyntaxKind.ArrayLiteralExpression);
              }
            } else {
              arrayExpressions = jsxExp.getChildrenOfKind(SyntaxKind.ArrayLiteralExpression);
            }
            if (!!arrayExpressions && arrayExpressions.length > 0) {
              const arrayExp = arrayExpressions[0] as ArrayLiteralExpression;

              //iterate trough children
              arrayExp.forEachChild(child => {

                if (child.getKind() == SyntaxKind.ObjectLiteralExpression) {
                  // Icon as object
                  const objectLiteral = child as ObjectLiteralExpression;

                  if (!!objectLiteral) {
                    let iconName = "";

                    const icon = objectLiteral.getProperty('icon');

                    if (!!icon) {
                      const stringLiteral = icon.getChildrenOfKind(SyntaxKind.StringLiteral)[0];
                      if (!!stringLiteral) {
                        iconName = stringLiteral.getLiteralValue();

                        if (isValidIconName(iconName)) {
                          let ComponentName = convertNameToIconComponentName(iconName);
                          iconNames.push(ComponentName);
                          objectLiteral.insertProperty(0, {
                            kind: StructureKind.PropertyAssignment,
                            name: 'icon',
                            initializer: `<${ComponentName} />`
                          });
                          // remove it from the object literal
                          (icon as any).remove();
                        } else {
                          // file.insertText(0, "// TODO: There is an icon name that was not resolved \n");
                        }

                      } else {
                        // Icon as object
                        const iconObjectLiteral = icon.getChildrenOfKind(SyntaxKind.ObjectLiteralExpression)[0];

                        if (!!iconObjectLiteral) {
                          let iconName = "";

                          const name = iconObjectLiteral.getProperty('name');

                          if (!!name) {
                            // save the name
                            const stringLiteral = name.getChildrenOfKind(SyntaxKind.StringLiteral)[0];
                            if (stringLiteral) {
                              iconName = stringLiteral.getLiteralValue();
                            } else {
                              // TODO: name can come from a local variable..
                            }
                          }

                          if (isValidIconName(iconName)) {
                            let ComponentName = convertNameToIconComponentName(iconName);
                            iconNames.push(ComponentName);

                            // remove it from the object literal
                            (name as any).remove();

                            let initializer = "";
                            initializer += `<${ComponentName} {...`;
                            initializer += iconObjectLiteral.getText();
                            initializer += '} />';

                            objectLiteral.insertProperty(0, {
                              kind: StructureKind.PropertyAssignment,
                              name: 'icon',
                              initializer,
                            });
                            // remove it from the object literal
                            (icon as any).remove();
                          } else {
                            // file.insertText(0, "// TODO: There is an icon name that was not resolved \n");
                          }
                        }
                      }

                    }
                  }
                }
              })
            }
          }
        }
      }
    }
  });

  addFilteredIconNames(iconNames, file);
}

export function convertIconComponent(file: SourceFile) {

  const elements = utilities.findJsxTagInFile(file, 'Icon');
  const iconNames: string[] = [];

  console.log("Processing file " + file.getBaseName());

  elements.forEach(val => {
    const att = val.getAttribute('name');
    if (!!att) {
      const tAtt = att! as JsxAttribute;

      const exp = tAtt.getChildrenOfKind(SyntaxKind.JsxExpression)[0];

      let stringLiteral = null;

      if(!!exp) {
        stringLiteral = exp.getChildrenOfKind(SyntaxKind.StringLiteral)[0];
      } else {
        stringLiteral = tAtt.getChildrenOfKind(SyntaxKind.StringLiteral)[0];
      }

      if(!!stringLiteral) {
        const iconName = stringLiteral.getLiteralValue();
        let ComponentName = "";

        if (isValidIconName(iconName)) {
          ComponentName = convertNameToIconComponentName(iconName);
          iconNames.push(ComponentName);
        }

        if(ComponentName && ComponentName.length > 0) {
          if(val.getKind() === SyntaxKind.JsxSelfClosingElement ) {
            (att as any).remove();
            (val as JsxSelfClosingElement).set({
              name: ComponentName
            })
          } else {
            // file.insertText(0, "// TODO: There is an icon name that was not resolved \n");
          }
        } else {
          // file.insertText(0, "// TODO: There is an icon name that was not resolved \n");
        }
      }
    }
  });

  addFilteredIconNames(iconNames, file);
}
