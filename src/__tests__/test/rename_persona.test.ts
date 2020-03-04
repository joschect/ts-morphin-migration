import {Project,SyntaxKind, InterfaceDeclaration, Node } from 'ts-morph';
import {ReplacePersonaImport, ReplaceIPersonaPropsImport} from '../../mods/rename_persona';
import {utilities} from '../../utilities';
const personaPath = '/**/__tests__/mock/**/persona/**/*.tsx';

describe('utilities test', () => {
  let project: Project;
  beforeEach(()=> {
   project = new Project();
   project.addSourceFilesAtPaths(`${process.cwd()}${personaPath}`);

  })
  it('can replace persona with avatar', ()=> {
      const files = project.getSourceFiles();
      files.forEach(ReplacePersonaImport);
      files.forEach(file => {
        file.getImportDeclarations().forEach(imp => {
          imp.getNamedImports().forEach(name => {
            expect(name.getText()).not.toEqual("Persona");
          });
        });
        expect(utilities.findJsxTagInFile(file, "Persona").length).toBe(0);
      });
  });

  it('can replace IPersonaProps with AvatarProps', ()=> {
      const files = project.getSourceFiles();
      files.forEach(ReplaceIPersonaPropsImport);
      files.forEach(file => {
        file.getImportDeclarations().forEach(imp => {
          imp.getNamedImports().forEach(name => {
            expect(name.getText()).not.toEqual("IPersonaProps");
          });
        });
        file.forEachDescendant(val=> {
            switch (val.getKind()) {
            case SyntaxKind.InterfaceDeclaration:
                let t_val = val as InterfaceDeclaration
                const struct = t_val.getStructure();
                expect((struct.extends as string[])?.some(val => {
                    return val === "IPersonaProps";
                })).toBe(false);
            }
        })
      });
  });

  it('can replace PersonaSize with AvatarSize', ()=> {
      const files = project.getSourceFiles();
      const refe: Node[] = [];
      files.forEach(foo => {
        foo.getImportDeclarations().forEach(f => {
          f.getNamedImports().forEach(name => {
              if(name.getText() === "PersonaSize") {
                  let refs = name.getNameNode().findReferencesAsNodes();
                  refe.concat(refs);
              }
          });
        });
      });
      files.forEach(ReplaceIPersonaPropsImport);
      refe.forEach(val => {
          // I'm not convinced that this is the best way to test this particular
          // case, but I'm not sure how else to have a dynamic list of 
          // all the cases where AvatarSize is actually used.
          expect(val.getText()).toEqual("AvatarSize");
      });
  });

});