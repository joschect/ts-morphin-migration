const { jestTask, task, tscTask, cleanTask, defaultCleanPaths, series, parallel } = require('just-scripts');

task("jest", jestTask());
task("jest:watch", jestTask({ watch: true }));
task("clean", cleanTask([...defaultCleanPaths(), "lib"]));
task("ts:watch", tscTask({ module: "commonjs", outDir: "lib", watch: true }));
task("start", series("clean", "ts:watch"));
task('ts:commonjs', tscTask({ module: 'commonjs', outDir: 'lib' }));
task('ts', parallel('ts:commonjs')); 
task('build', series('ts'));