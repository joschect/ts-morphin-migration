import {
  SourceFile,
  SyntaxKind,
  JsxAttribute
} from "ts-morph";
import { utilities } from "../utilities/utilities";

const inconsistentNames: any = {};

inconsistentNames['icon-circle'] = "CircleIcon";
inconsistentNames['chevron-right-medium'] = "ChevronEndMediumIcon";
inconsistentNames['triangle-right'] = "TriangleEndIcon";
inconsistentNames['onenote'] = "OneNoteIcon";
inconsistentNames['onenote-color'] = "OneNoteColorIcon";
inconsistentNames['onedrive'] = 'OneDriveIcon';
inconsistentNames['powerpoint'] = "PowerPointIcon";
inconsistentNames['powerpoint-color'] = "PowerPointColorIcon";
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

const convertNameToIconComponentName = (iconName: string) => {
  if(inconsistentNames[iconName]) return inconsistentNames[iconName];
  let componentName = "";
  let convertToUpperCase = true;
  for(let i=0; i<iconName.length; i++) {
    if(iconName[i] !== '-'){
      if(convertToUpperCase) {
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
export function renameIconString(file: SourceFile) {

  const elements = utilities.findJsxTagInFile(file, 'Button', 'Reaction', 'MenuItem', 'Menu.Item', 'Status', 'Attachment', 'Input', 'ToolbarMenuItem', 'Label', 'Alert', 'ToolbarItem', 'DropdownSelectedItem');
  const iconNames: string[] = [];

  console.log("Processing file " + file.getBaseName());

  elements.forEach(val => {
    const att = val.getAttribute('icon');
    if(!!att) {
      if(att!.getKind() !== SyntaxKind.JsxSpreadAttribute) {
        const tAtt = att! as JsxAttribute;

        const exp = tAtt.getChildrenOfKind(SyntaxKind.JsxExpression)[0];

        if(!!exp) {
          // Icon as string
          const stringLiteral = exp.getChildrenOfKind(SyntaxKind.StringLiteral)[0];

          if(!!stringLiteral) {

            const iconName = stringLiteral.getLiteralValue();

            let ComponentName = convertNameToIconComponentName(iconName);
            iconNames.push(ComponentName); // add icons for creating import statements

            tAtt.setInitializer(`{<${ComponentName} />}`);
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
                } else {
                  // TODO: name can come from a local variable..
                }
                // remove it from the object literal
                (name as any).remove();
              }

              let ComponentName = convertNameToIconComponentName(iconName);
              iconNames.push(ComponentName); // add icons for creating import statements

              // tAtt.setInitializer(`{<${ComponentName} {...${JSON.stringify(spreadObj)}} />}`);

              // Figure out a better way...
              let initializer = "";
              initializer += `{<${ComponentName} {...`;
              initializer += objectLiteral.getText();
              initializer += '} />}';
              tAtt.setInitializer(initializer);
            }
          }

        } else {
          // Icon as string
          const stringLiteral = tAtt.getChildrenOfKind(SyntaxKind.StringLiteral)[0];

          if (!!stringLiteral) {

            const iconName = stringLiteral.getLiteralValue();

            let ComponentName = convertNameToIconComponentName(iconName);
            iconNames.push(ComponentName); // add icons for creating import statements

            tAtt.setInitializer(`{<${ComponentName} />}`);
          }
        }

      }
    }
  });

  // remove duplicates
  const filteredIconNames = iconNames.filter((name, idx) => iconNames.indexOf(name) === idx);

  if(filteredIconNames.length > 0) {
    file.addImportDeclaration({
      namedImports: filteredIconNames,
      moduleSpecifier: '@fluentui/react-icons-northstar'
    });
  }
}
