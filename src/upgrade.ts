import {
  runMods,
  getModsPaths,
  getTsConfigs,
  filterMods,
  loadMod,
} from "./modRunner/runnerUtilities";
import { Project } from "ts-morph";


// TODO actually do console logging, implement some nice callbacks.
export function upgrade() {
  let mods = getModsPaths()
  .filter((pth)=> pth.endsWith('.js'))
    .map((pth) => {
      console.log("fetching codeMod at ", pth)
      return loadMod(pth, (e) => {
        console.error(e);
      });
    })
    .filter((result) => result.success)
    .map((mod) => mod.mod!);
  console.log('getting configs')
  let configs = getTsConfigs();
  let projects: Project[] = configs.map(
    (configString) => new Project({ tsConfigFilePath: configString })
  );

  projects.forEach((project) => {
    let error = false;
    try {
      console.log(`getting files from project`)
      let files = project.getSourceFiles();
      runMods(mods, files);
    } catch (e) {
      console.error(e);
      error = true;
    }
    if (!error) {
      project.save();
    }
  });
}
