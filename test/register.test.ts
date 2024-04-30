import {Suite, suite, Test, test} from "mocha";
import {strict as assert} from "node:assert";
import {grandparentTests, newRoot, orphanTests, parentTests, transform} from "./fixture.ts";

test('title', () => {
  const {suites: [suite]} = transform(parentTests('main'));
  assert.equal(suite.title, 'main');
});

suite('rebased tests', () => {
  test('common parent', () => {
    const {suites: [suite]} = transform(parentTests(''));
    assert.deepEqual(suite.tests.map(test => test.title), ['one', 'two']);
  });

  test('common grandparent', () => {
    const {suites: [{suites: [suite]}]} = transform(grandparentTests());
    assert.deepEqual(suite.tests.map(test => test.title), ['one', 'two']);
  });
});

suite('root', () => {
  test('orphan tests', () => {
    const {tests} = transform(orphanTests());
    assert.deepEqual(tests.map(test => test.title), ['one', 'two']);
  });

  test('flag', () => {
    const result = transform(newRoot());
    assert(result.root);
  });

  test('child', () => {
    const {suites: [suite]} = transform(parentTests(''));
    assert(!suite.root);
  });
});

test('context', function () {
  this.timeout(10);
});

suite('context, suite', function () {
  test('context', function () {
    this.timeout(10);
  });
});
