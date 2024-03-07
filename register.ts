import {Runner, Suite} from 'mocha';

export function mochaGlobalSetup(this: Runner): void {
  this.suite = newSuite(this.suite, joinedSuites(this.suite));
}

function newSuite(parent: Suite, suites: SuiteMap) {
  const root = new Suite('');
  root.root = true;
  parent.tests.forEach(test => root.addTest(test));
  suites.forEach(suite => root.addSuite(suite));
  return root;
}

function joinedSuites(root: Suite) {
  const suites = new SuiteMap();
  root.suites.forEach(suite => {
    const joined = suites.instance(suite.title);
    suite.suites.forEach(suite => joined.addSuite(suite));
    suite.tests.forEach(test => joined.addTest(test));
  });
  return suites;
}

class SuiteMap {
  private suites: { [key: string]: Suite } = {};

  public instance(title: string): Suite {
    return this.suites[title] = this.suites[title] || new Suite(title);
  }

  public forEach(consumer: (suite: Suite) => void): void {
    Object.values(this.suites).forEach(consumer);
  }
}
