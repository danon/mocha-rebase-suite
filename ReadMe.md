## Overview

### Problem at hand

Mocha `test()` are not grouped by parent dictionaries of the files they
are present in. Thus, mocha results are a flat list of tests, which
are additionally sorted alphabetically, which makes it hard to gather details.

In vanilla mocha, we have two ways to side-step it:

- Add `suite()` to each file

  But if the suites have the same name, mocha will not rebase them by default.
  Names of the tests in each test file are being displayed as an ever-growing
  tree of tested suites, which is also hard to read and gather details.

- Calling `suite()` only at the top level of the entry point of tests.

  Ignoring the additional overhead of calling own tests manually, that makes
  most IDEs feature "Run this test" not recognize test methods - because
  IDEs don't understand this notation.

  Furthermore, running individual test cases is not possible, because `--grep`
  in mocha doesn't see the whole "test path".

### Solution

A possible compromise is to use the first approach (an ever-growing
tree of test suites) in order to retain enough details, but additionally,
adding a mocha extension, which joins the test results by suite title,
displaying them in a concise list.

## Installation

```
yarn add @riddled/mocha-rebase-suite
```

Register the extension:

1. When running mocha cli:
   ```
   mocha --require @riddled/mocha-rebase-suite
   ```
2. With `.mocharc.json`:

   ```json
   {
     "require": [
       "@riddled/mocha-rebase-suite"
     ]
   }
   ```
