## Thank you

Thank you for your interest in contributing. Please read carefully and notify me of any errors. Much appreciated.

## Dev Setup

1. Fork and clone the forked repository
2. In your cloned forked repository, create a new branch with easy to identify branch names. (e.g issue/number, fix/some-bug)
3. In terminal or console, head to the main sitegen directory and call `npm install` to install all dependencies.
4. Then call `npm install -g` to use `osd-sitegen <command-option>` directly in the command line.
5. Make changes and commits
6. Rebase into a single commit
7. Create pull request

### Contributing to tests

- Run coverage analysis to figure out which lines of code still needs tests
- Follow the format to keep tests for functions/classes from the same file, in the same test file
- If a test file or describe doesn't exist, please create a test file, and write a "describe" for individual function/class
- Create tests. Tests should be small, don't worry about covering everything.
- Run coverage to make sure coverage has improved and not gotten worse
- For more specific information please read the [Jest Documentation](https://jestjs.io/docs/getting-started)

---

### Current Node and npm versions

- Node: "v16.13.0"
- npm: "8.1.1

### Dependencies

Commander: "^8.2.0"
Remarkable: "^2.0.1"

### Dev Dependencies

Prettier: "2.4.1"
ESLint: "^8.1.0"
Husky: "^7.0.0"
Exca: "^5.1.1"
Jest: "^27.3.1"

---

### Pre-commit

Husky pre-commit hook is set up so the scripts for `Prettier` and `ESLint` will be automatically run every time there is a commit.

---

### Useful manual Scripts

1. Formatting:
   - `npm run prettier-check`: Check if files have been formatted
   - `npm run prettier`: Format files based on Prettier code
2. Linting:
   - `npm run eslint`: Undergo eslint checks
   - `npm run eslint-fix`: Auto fix with eslint
   - `npm run lint`: Undergo eslint checks
3. Tests:
   - `npm run test`: To run all available tests
   - `npm run test <path-to-test-file>`: To run tests on a specific file
   - `npm run coverage`: To get coverage information for all tests
   - `npm run coverage <path-to-test-file>`: To run specific coverage for a test fil

---

## VSCode recommendations and settings

#### Recommended Extensions:

- ESLint: `dbaeumer.vscode-eslint`
- Prettier: `esbenp.prettier-vscode`

#### Settings:

- Please install the recommended extensions in VSCode for settings to work correctly.
- The `.vscode\settings.json` currently has it configured for `prettier` as the default format.
- The editor will automatically format on save based on prettier code styles.
- The editor has lint task for ESLint turned on, which will provide errors and warnings as the code is written.

---
