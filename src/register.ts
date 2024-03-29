import {Runner, Suite} from 'mocha';

export function mochaGlobalSetup(this: Runner): void {
  this.suite = rebasedSuite(this.suite);
}

function rebasedSuite(suite: Suite): Suite {
  const suites = new SuiteMap();
  suite.suites.forEach(suite => {
    const joined = suites.instance(suite.title);
    suite.suites.forEach(suite => joined.addSuite(suite));
    suite.tests.forEach(test => joined.addTest(test));
  });
  return newSuite(suite, suites.suites());
}

function newSuite(parent: Suite, suites: Suite[]): Suite {
  const newSuite = new Suite(parent.title);
  newSuite.root = true;
  parent.tests.forEach(test => newSuite.addTest(test));
  suites.forEach(suite => newSuite.addSuite(rebasedSuite(suite)));
  return newSuite;
}

class SuiteMap {
  private dictionary: { [key: string]: Suite } = {};

  public instance(title: string): Suite {
    return this.dictionary[title] = this.dictionary[title] || new Suite(title);
  }

  public suites(): Suite[] {
    return Object.values(this.dictionary);
  }
}
