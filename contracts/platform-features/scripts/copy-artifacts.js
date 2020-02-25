const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const mustache = require('mustache');

const CONTRACT_NAMES = require('../../../packages/deployment/MAIN_CONTRACTS');

const TYPES_PATH = '../contracts/build/Contracts';
const TS_PATH = '../../packages/artifacts/src/ts/';
const JSON_PATH = '../../packages/artifacts/src/json/';
const ADDRESSES_PATH = '../../packages/addresses/src/';

fs.ensureDirSync(TS_PATH);
fs.ensureDirSync(JSON_PATH);

const template = `/**
 *
 * This is an auto-generated file from running 'yarn generate-artifacts'
 *
*/`;

// const walkSync = (dir, filenames = [], filelist = []) => {
//   fs.readdirSync(dir).forEach((file) => {
//     filelist = fs.statSync(path.join(dir, file)).isDirectory()
//       ? walkSync(path.join(dir, file), filelist)
//       : filelist.concat({
//           file: file,
//           name: file.split('.')[0],
//           path: path.join(dir, file),
//         });
//   });

//   return filelist.filter((item) => filenames.includes(item.name));
// };

// async function copyFiles() {
//   const files = walkSync(TYPES_PATH, CONTRACT_NAMES);
//   files.map((file) => {
//     let newFile = JSON.parse(fs.readFileSync(file.path));
//     newFile = newFile.abi;
//     newFile = JSON.stringify(newFile, null, 2);
//     fs.writeFileSync(`../../packages/artifacts/src/json/${file.file}`, newFile);
//     fs.writeFileSync(
//       `../../packages/artifacts/src/ts/${file.name}.ts`,
//       `export const ${file.name} = ${newFile}`,
//     );
//   });

//   const exports = files
//     .map((item) => {
//       return `export { ${item.name} } from './ts/${item.name}';`;
//     })
//     .join('\n');

//   const file = `${template}\n\n${exports}`;
//   fs.writeFileSync(`../../packages/artifacts/src/index.ts`, file);

//   console.log(files);
// }

// copyFiles();

var mainReadme = mustache.render(
  fs.readFileSync('../../readme.mustache').toString(),
  fs.readJSONSync(ADDRESSES_PATH + 'outputs' + '.json'),
);
fs.writeFileSync('../../README.md', mainReadme);
