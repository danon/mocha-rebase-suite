import {type Context, type Hook, Runner, Suite} from 'mocha';

export function mochaGlobalSetup(this: Runner): void {
  this.suite = rebasedSuite(this.suite);
  this.suite.root = true;
}

function rebasedSuite(suite: Suite): Suite {
  const suites = new SuiteMap();
  suite.suites.forEach(suite => {
    const joined = suites.instance(suite.title, suite.ctx);
    suite.suites.forEach(suite => {
      suite.parent = joined;
      joined.suites.push(suite);
    });
    copyTo(suite, joined);
  });
  return newSuite(suite, suites.suites());
}

function newSuite(parent: Suite, suites: Suite[]): Suite {
  const newSuite = new Suite(parent.title, parent.ctx);
  suites.forEach(suite => newSuite.addSuite(rebasedSuite(suite)));
  copyTo(parent, newSuite);
  return newSuite;
}

function copyTo(source: Suite, target: Suite): void {
  target.timeout(source.timeout());
  source['_beforeAll'].forEach((hook: Hook) => target.beforeAll(hook.title, hook.fn));
  source['_beforeEach'].forEach((hook: Hook) => target.beforeEach(hook.title, hook.fn));
  source['_afterEach'].forEach((hook: Hook) => target.afterEach(hook.title, hook.fn));
  source['_afterAll'].forEach((hook: Hook) => target.afterAll(hook.title, hook.fn));
  source.tests.forEach(test => target.addTest(test));
}

class SuiteMap {
  private dictionary: { [key: string]: Suite } = {};

  public instance(title: string, context: Context): Suite {
    return this.dictionary[title] = this.dictionary[title] || new Suite(title, context);
  }

  public suites(): Suite[] {
    return Object.values(this.dictionary);
  }
}
