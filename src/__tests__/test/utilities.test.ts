import {utilities } from '../../utilities';
import {Project, SourceFile} from 'ts-morph';
import {JSXNames} from '../mock/mock_function';
const project = new Project();
project.addSourceFilesAtPaths(`${process.cwd()}/**/__tests__/mock/**/*.tsx`);
const file_name = 'mock_function.tsx'
describe('utilities test', () => {
  it('can find a regular jsx tag', ()=> {
    const tag = utilities.findJsxTagInFile(project.getSourceFileOrThrow(file_name), JSXNames.JSXFunctionalNormalTag)
    expect(tag.length).toEqual(1);
  });

  it('can find a self closing jsx tag', ()=> {
    const tag = utilities.findJsxTagInFile(project.getSourceFileOrThrow(file_name), JSXNames.JSXFunctionalSelfClosingTag)
    expect(tag.length).toEqual(1);
  });

  it('can replace a tag', ()=> {
    const file = project.getSourceFileOrThrow(file_name);
    utilities.renameImport(file, 'ToImport', 'Renamed')
    expect(file.getText().indexOf("ToImport")).toBe(-1);
  });

  it('runs codemods on all files in a project', ()=>{
    const mock_codemod = (file: SourceFile) => {
      file.insertText(file.getEnd(), "123Modified123");
    }
    utilities.applyCodeMods(project.getSourceFiles(), mock_codemod);
    project.getSourceFiles().forEach(file=> {
      expect(file.getText().indexOf("123Modified123")).toBeGreaterThan(-1);
    });
  });
});