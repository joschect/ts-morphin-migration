import {
  ArrayLiteralExpression, Identifier,
  JsxAttribute,
  JsxExpression, JsxSelfClosingElement,
  ObjectLiteralExpression,
  SourceFile,
  StructureKind,
  SyntaxKind,
  JsxOpeningElement
} from "ts-morph";
import {utilities} from "../utilities/utilities";

const inconsistentNames: any = {};

inconsistentNames['chevron-right-medium'] = "ChevronEndMediumIcon";
inconsistentNames['triangle-right'] = "TriangleEndIcon";
inconsistentNames['onenote'] = "OneNoteIcon";
inconsistentNames['onenote-color'] = "OneNoteColorIcon";
inconsistentNames['onedrive'] = 'OneDriveIcon';
inconsistentNames['powerpoint'] = "PowerPointIcon";
inconsistentNames['powerpoint-color'] = "PowerPointColorIcon";

inconsistentNames['icon-circle'] = "CircleIcon";
inconsistentNames['icon-checkmark'] = "AcceptIcon";
inconsistentNames['icon-circle'] = "CircleIcon";
inconsistentNames['icon-close'] = "CloseIcon";
inconsistentNames['icon-arrow-up'] = "TriangleUpIcon";
inconsistentNames['icon-arrow-down'] = "TriangleDownIcon";
inconsistentNames['icon-arrow-end'] = "TriangleEndIcon";
inconsistentNames['icon-menu-arrow-down'] = "ChevronDownMediumIcon";
inconsistentNames['icon-menu-arrow-end'] = "ChevronEndMediumIcon";
inconsistentNames['icon-pause'] = "PauseIcon";
inconsistentNames['icon-play'] = "PlayIcon";

inconsistentNames['stardust-circle'] = "CircleIcon";
inconsistentNames['stardust-checkmark'] = "AcceptIcon";
inconsistentNames['stardust-circle'] = "CircleIcon";
inconsistentNames['stardust-close'] = "CloseIcon";
inconsistentNames['stardust-arrow-up'] = "TriangleUpIcon";
inconsistentNames['stardust-arrow-down'] = "TriangleDownIcon";
inconsistentNames['stardust-arrow-end'] = "TriangleEndIcon";
inconsistentNames['stardust-menu-arrow-down'] = "ChevronDownMediumIcon";
inconsistentNames['stardust-menu-arrow-end'] = "ChevronEndMediumIcon";
inconsistentNames['stardust-pause'] = "PauseIcon";
inconsistentNames['stardust-play'] = "PlayIcon";

const convertNameToIconComponentName = (iconName: string) => {
  if (inconsistentNames[iconName]) return inconsistentNames[iconName];
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

// <Button icon={'some-string'}/>] =  <Button icon={<SomeString/>}/>
export function convertIconProp(file: SourceFile) {

  const elements = utilities.findJsxTagInFile(file, 'Button', 'Reaction', 'MenuItem', 'Menu.Item', 'Status', 'Attachment', 'Input', 'ToolbarMenuItem', 'Toolbar.MenuItem', 'Label', 'Alert', 'ToolbarItem', 'Toolbar.Item', 'DropdownSelectedItem',
    // tmp components
    'ButtonWithRef',
    'ButtonWithTooltip', // add and update typings
    'CompanionButton', // add and update typings
    'NonAccessibleButton',
    'CallingRosterActionButton<string>',
    'CallingRosterActionButton<string>',
    'Element',
    )
  ;
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

            const iconName = stringLiteral.getLiteralValue();
            if (iconName && iconName.length > 0) {

              let ComponentName = convertNameToIconComponentName(iconName);
              iconNames.push(ComponentName); // add icons for creating import statements

              tAtt.setInitializer(`{<${ComponentName} />}`);
            }
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

              if (iconName && iconName.length > 0) {
                let ComponentName = convertNameToIconComponentName(iconName);
                iconNames.push(ComponentName); // add icons for creating import statements

                // remove it from the object literal
                (name as any).remove();

                // Figure out a better way...
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

            const iconName = stringLiteral.getLiteralValue();

            if (iconName && iconName.length > 0) {
              let ComponentName = convertNameToIconComponentName(iconName);
              iconNames.push(ComponentName); // add icons for creating import statements

              tAtt.setInitializer(`{<${ComponentName} />}`);
            } else {
              // file.insertText(0, "// TODO: There is an icon name that was not resolved \n");
            }
          }
        }

      }
    }
  });

  // remove duplicates
  const filteredIconNames = iconNames.filter((name, idx) => iconNames.indexOf(name) === idx);

  if (filteredIconNames.length > 0) {
    file.addImportDeclaration({
      namedImports: filteredIconNames,
      moduleSpecifier: '@fluentui/react-icons-northstar'
    });
  }
}

// <ButtonGroup buttons={[{icon: 'some-string'}]} />] =  <Button buttons={[{icon: <SomeString/>}]}/>
export function convertIconInShorthandProp(file: SourceFile) {
  const mapComponentToPropName: any = {
    'ButtonGroup': 'buttons',
    'Button.Group': 'buttons',
    'Menu': 'items',
    'Toolbar': 'items',
    'ReactionGroup': 'items',
    'Reaction.Group': 'items',
    'ToolbarMenu': 'items',
    'Toolbar.Menu': 'items',
    'MenuButton': 'menu',
    'ContextMenu': 'items'
  };

  const elements = utilities.findJsxTagInFile(file, 'ButtonGroup', 'Button.Group', 'Menu', 'Toolbar', 'ToolbarMenu', 'Toolbar.Menu', 'ReactionGroup', 'Reaction.Group', 'MenuButton',
    // tmp components
    'ContextMenu',
  );
  const iconNames: string[] = [];

  console.log("Processing file " + file.getBaseName());

  elements.forEach(val => {
    const tag = (val as any).getStructure().name;
    const att = val.getAttribute(mapComponentToPropName[tag]);
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

                        if (iconName && iconName.length > 0) {
                          let ComponentName = convertNameToIconComponentName(iconName);
                          iconNames.push(ComponentName); // add icons for creating import statements
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

                          if (iconName && iconName.length > 0) {
                            let ComponentName = convertNameToIconComponentName(iconName);
                            iconNames.push(ComponentName); // add icons for creating import statements

                            // remove it from the object literal
                            (name as any).remove();

                            // Figure out a better way...
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

  // remove duplicates
  const filteredIconNames = iconNames.filter((name, idx) => iconNames.indexOf(name) === idx);

  if (filteredIconNames.length > 0) {
    file.addImportDeclaration({
      namedImports: filteredIconNames,
      moduleSpecifier: '@fluentui/react-icons-northstar'
    });
  }
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

      if (!!exp) {
        // name as expression string {'bookmark'}
        const stringLiteral = exp.getChildrenOfKind(SyntaxKind.StringLiteral)[0];

        if (!!stringLiteral) {

          const iconName = stringLiteral.getLiteralValue();
          let ComponentName = "";

          if (iconName && iconName.length > 0) {
            ComponentName = convertNameToIconComponentName(iconName);
            iconNames.push(ComponentName); // add icons for creating import statements
          }

          if(ComponentName && ComponentName.length > 0) {
            (att as any).remove();
            if(val.getKind() === SyntaxKind.JsxSelfClosingElement ) {
              (val as JsxSelfClosingElement).set({
                name: ComponentName
              })
            }
          } else {
            // file.insertText(0, "// TODO: There is an icon name that was not resolved \n");
          }
        }
      } else {
        // name as string 'bookmark'
        const stringLiteral = tAtt.getChildrenOfKind(SyntaxKind.StringLiteral)[0];

        if (!!stringLiteral) {

          const iconName = stringLiteral.getLiteralValue();

          let ComponentName = "";

          if (iconName && iconName.length > 0) {
            ComponentName = convertNameToIconComponentName(iconName);
            iconNames.push(ComponentName); // add icons for creating import statements
          }

          if(ComponentName && ComponentName.length > 0) {
            (att as any).remove();
            if(val.getKind() === SyntaxKind.JsxSelfClosingElement ) {
              (val as JsxSelfClosingElement).set({
                name: ComponentName
              })
            }
          } else {
            // file.insertText(0, "// TODO: There is an icon name that was not resolved \n");
          }
        }
      }
    }
  });

  // remove duplicates
  const filteredIconNames = iconNames.filter((name, idx) => iconNames.indexOf(name) === idx);

  if (filteredIconNames.length > 0) {
    file.addImportDeclaration({
      namedImports: filteredIconNames,
      moduleSpecifier: '@fluentui/react-icons-northstar'
    });
  }
}
