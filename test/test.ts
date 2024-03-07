import {test} from "mocha";
import {strict as assert} from "node:assert";

test('empty', () => {
  const actual: boolean = true;
  assert.equal(actual, true);
});
