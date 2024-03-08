import {spawnSync} from 'node:child_process';
import fileSystem from 'node:fs';
import {dirname} from 'node:path';
import {argv} from 'node:process';

if (argv.length === 3) {
  buildPackage(argv[2]);
} else {
  console.error('Invalid command. Usage: {tag}');
}

function buildPackage(version) {
  removeDirectory('./package/');
  buildTypeScript([
    './project/tsconfig.cjs.json',
    './project/tsconfig.esm.json',
    './project/tsconfig.types.json',
  ]);
  saveJsonFile('./package/package.json',
    distributionPackageJson(
      './public/package.json',
      '../package.json',
      version));
  saveFile('./package/LICENSE', readFile('./public/LICENSE'));
}

function distributionPackageJson(templatePackage, sourcePackage, version) {
  return {
    ...readJsonFile(templatePackage),
    version,
    dependencies: readJsonFile(sourcePackage).dependencies,
  };
}

function removeDirectory(path) {
  fileSystem.rmSync(path, {recursive: true, force: true});
}

function buildTypeScript(projects) {
  const result = spawnSync('yarn', ['run', 'tsc', '--build', ...projects], {shell: true});
  if (result.status !== 0) {
    console.log(result.stdout.toString());
    process.exit(result.status);
  }
}

function readJsonFile(path) {
  return JSON.parse(readFile(path));
}

function readFile(path) {
  return fileSystem.readFileSync(path).toString();
}

function saveJsonFile(path, content) {
  saveFile(path, JSON.stringify(content, null, 2));
}

function saveFile(path, content) {
  createParentDirectory(path);
  fileSystem.writeFileSync(path, content);
}

function createParentDirectory(path) {
  const parent = dirname(path);
  if (!fileSystem.existsSync(parent)) {
    fileSystem.mkdirSync(parent);
  }
}
