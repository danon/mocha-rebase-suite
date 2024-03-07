import {Runner, Suite, suite, Test, test} from "mocha";
import {strict as assert} from "node:assert";

import * as mochaExtension from "../src/register.ts";

test('joined suite title', function () {
  const {suites: [suite]} = transform(singleTests());
  assert.deepEqual(suite.title, 'main');
});

test('two tests', function () {
  const {suites: [suite]} = transform(singleTests());
  assert.deepEqual(suite.tests.map(test => test.title), ['one', 'two']);
});

test('orphan tests', function () {
  const {tests} = transform(orphanTests());
  assert.deepEqual(tests.map(test => test.title), ['one', 'two']);
});

suite('root/', function () {
  test('flag', function () {
    const result = transform(new Suite(''));
    assert.deepEqual(result.root, true);
  });
});

suite('root/', function () {
  test('empty title', function () {
    const result = transform(new Suite(''));
    assert.deepEqual(result.root, true);
  });
});

function transform(suite: Suite): Suite {
  const runner = new Runner(suite);
  mochaExtension['mochaGlobalSetup'].call(runner);
  return runner.suite;
}

function singleTests(): Suite {
  const suite = new Suite('');
  suite.addSuite(newSuite('main', new Test('one')));
  suite.addSuite(newSuite('main', new Test('two')));
  return suite;
}

function newSuite(title: string, test: Test): Suite {
  const suite = new Suite(title);
  suite.addTest(test);
  return suite;
}

function orphanTests() {
  const root = new Suite('');
  root.addTest(new Test('one'));
  root.addTest(new Test('two'));
  return root;
}
