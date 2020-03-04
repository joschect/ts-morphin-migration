import {Project,SyntaxKind, InterfaceDeclaration } from 'ts-morph';
import {ReplacePersonaImport, ReplaceIPersonaPropsImport} from '../../mods/rename_persona';
import {utilities} from '../../utilities';
const project = new Project();
project.addSourceFilesAtPaths(`${process.cwd()}/**/__tests__/mock/**/persona/**/*.tsx`);

describe('utilities test', () => {
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
      files.forEach(ReplaceIPersonaPropsImport);
      files.forEach(file => {
        file.getImportDeclarations().forEach(imp => {
          imp.getNamedImports().forEach(name => {
            expect(name.getText()).not.toEqual("PersonaSize");
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
            return false
        })

      });

  });

});