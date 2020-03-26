
import {
  SourceFile,
  SyntaxKind,
  JsxAttribute,
  JsxExpression
} from "ts-morph";
import { utilities } from "../utilities/utilities";


// <Button icon={'some-string'}/> -> <Button icon={<SomeStringIcon/>}/>
export function renameIconString(file: SourceFile) {
  const elements = utilities.findJsxTagInFile(file, 'Button');

  elements.forEach(val => {
    const att = val.getAttribute('icon');
    if(!!att) {
      if(att!.getKind() !== SyntaxKind.JsxSpreadAttribute) {
        const tAtt = att! as JsxAttribute;
        const exp = tAtt.getChildrenOfKind(SyntaxKind.JsxExpression)[0];
        tAtt.setInitializer('{<SomeStringIcon/>}');
      }
    }
  });
}
