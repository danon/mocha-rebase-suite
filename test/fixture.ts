import {Runner, Suite, Test} from "mocha";
import * as mochaExtension from "../src/register.ts";

export function transform(suite: Suite): Suite {
  const runner = new Runner(suite);
  mochaExtension['mochaGlobalSetup'].call(runner);
  return runner.suite;
}

export function parentTests(childTitle: string): Suite {
  const suite = new Suite('');
  suite.addSuite(newSuite(childTitle, new Test('one')));
  suite.addSuite(newSuite(childTitle, new Test('two')));
  return suite;
}

export function grandparentTests(): Suite {
  const suite = new Suite('');
  suite.addSuite(newParentSuite('main', newSuite('parent', new Test('one'))));
  suite.addSuite(newParentSuite('main', newSuite('parent', new Test('two'))));
  return suite;
}

function newParentSuite(title: string, child: Suite): Suite {
  const suite = new Suite(title);
  suite.addSuite(child);
  return suite;
}

function newSuite(title: string, test: Test): Suite {
  const suite = new Suite(title);
  suite.addTest(test);
  return suite;
}

export function orphanTests(): Suite {
  const root = newRoot();
  root.addTest(new Test('one'));
  root.addTest(new Test('two'));
  return root;
}

export function newRoot(): Suite {
  const suite = new Suite('');
  suite.root = true;
  return suite;
}
