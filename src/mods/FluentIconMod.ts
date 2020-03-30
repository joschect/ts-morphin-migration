import {
  SourceFile,
  SyntaxKind,
  JsxAttribute
} from "ts-morph";
import { utilities } from "../utilities/utilities";

const convertToCamelCase = (iconName: string) => {
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

  return componentName;
};

// <Button icon={'some-string'}/> -> <Button icon={<SomeString/>}/>
export function renameIconString(file: SourceFile) {
  // TODO: expand on more components
  const elements = utilities.findJsxTagInFile(file, 'Button');
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

            let ComponentName = convertToCamelCase(iconName);
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

              let ComponentName = convertToCamelCase(iconName);
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

            let ComponentName = convertToCamelCase(iconName);
            iconNames.push(ComponentName); // add icons for creating import statements

            tAtt.setInitializer(`{<${ComponentName} />}`);
          }
        }

      }
    }
  });

  // TODO: remove duplicates from iconNames
  if(iconNames.length > 0) {
    file.addImportDeclaration({
      namedImports: iconNames,
      moduleSpecifier: '@fluentui/react-icons-northstar'
    });
  }
}
