import {add, clear, dependencies, distribute, packageJson, tag, typeScript} from '@riddled/ts-release';
import {argv} from 'node:process';

if (argv.length === 3) {
  release(argv[2]);
} else {
  console.error('Invalid command. Usage: {tag} {output}\n\nExample: ./cli.ts 1.3.2');
}

function release(version: string): void {
  distribute('./package/', [
    clear(),
    tag(version),
    packageJson({
      name: '@riddled/mocha-rebase-suite',
      author: 'Daniel Wilkowski',
      license: 'MIT',
    }),
    dependencies('../package.json'),
    typeScript('../src/register.ts'),
    add('../LICENSE'),
  ]);
}
