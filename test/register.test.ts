import {after, setup, suite, suiteSetup, suiteTeardown, teardown, test} from "mocha";
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

suite('hooks', function () {
  suite('before each', function () {
    let called = false;
    setup(() => called = true);
    test('test', () => assert(called));
  });

  suite('before all', function () {
    let called = false;
    suiteSetup(() => called = true);
    test('test', () => assert(called));
  });

  suite('after each', function () {
    let called = false;
    teardown(() => called = true);
    test('ignore', () => null);
    test('check', () => assert(called));
  });

  suite('after all', function () {
    let called = false;
    suite('suite under test', () => {
      suiteTeardown(() => called = true);
      test('ignore', () => null);
    });
    suite('other', () => {
      test('check', () => assert(called));
    });
  });
});
