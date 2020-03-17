const tsGen = require('ts-generator').tsGenerator;
const Typechain = require('typechain').Typechain;
const fs = require('fs-extra')
const path = require('path');
const cwd = process.cwd();

const replace = require('replace-in-file');

const template =
`/**
 *
 * This is an auto-generated file from running 'yarn generate-typings'
 *
*/`;

const TYPES_PATH = './src/generated';

async function generateTypings() {
  await tsGen(
    { cwd },
    new Typechain({
      cwd,
      rawConfig: {
        files: 'build/contracts/**/*.json',
         outDir: TYPES_PATH,
         'target': 'ethers' },
    }),
  );
}

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat({
          file: file,
          name: file.split(".")[0],
          path: path.join(dir, file)
      })
  });
  return filelist.filter((item) => item.name != 'index');
}

async function replaceTypingsWithInterfaces() {
  const files = walkSync(TYPES_PATH)

  files.push({
    file: `index.d.ts`,
    name: `index`,
    path: `${TYPES_PATH}/index.d.ts`
  });

  console.log(files);

  files.filter(item => item.file.includes('.d.ts'))
  .forEach((file) => {
    const data = fs.readFileSync(file.path, 'utf8');
    const newPath = file.path.replace('.d.ts', '.ts');
    fs.renameSync(file.path, newPath, data);
    replace({
      files: newPath,
      from: 'export class',
      to: 'export interface'
    })
  });

  fs.writeFileSync(`${TYPES_PATH}/index.d.ts`, `${TYPES_PATH}/index.ts`);
}

async function generateIndexFile() {
  const files = walkSync(TYPES_PATH);

  const factoryFiles = files
  .filter(item => item.name.includes('Factory'))

  const firstImports = factoryFiles.map(item => {
    return `export { ${item.name} } from './generated/${item.name}';`;
  }).join('\n');

  factoryFiles.forEach(file => {
    replace({
      files: file.path,
      from: 'constructor(signer?: Signer) {',
      to: `name: string = "${file.name.replace('Factory','')}";\n  constructor(signer?: Signer) {`
    });
  });

  const contractFiles = files
  .filter(item => !item.name.includes('Factory'));

  const secondImports = contractFiles.map(item => {
    return `export { ${item.name} } from './generated/${item.name}';`
  }).join('\n');

  const file =  `${template}\n\n${firstImports}\n\n${secondImports}\n`;
  fs.writeFileSync(`${cwd}/src/contracts.ts`, file);
}

async function main() {
  await generateTypings();
  await replaceTypingsWithInterfaces();
  await generateIndexFile();

  console.log('The index file was successfully generated.');
}

try {
  main();
} catch(error) {
  console.log(error);
}