## Setup

Note, this release has not yet been published on npm.

1. Fork and clone the forked repository
2. In terminal or console, head to the main sitegen directory and call `npm install` to install all dependencies.
3. Then call `npm install -g` to use `sitegen <command-optioon>` directly in the command line.

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

---

## VSCode recommendations and settings

####Recommended Extensions:

- ESLint: `dbaeumer.vscode-eslint`
- Prettier: `esbenp.prettier-vscode`

#### Settings:

- Please install the recommended extensions in VSCode for settings to work correctly.
- The `.vscode\settings.json` currently has it configured for `prettier` as the default format.
- The editor will automatically format on save based on prettier code styles.
- The editor has lint task for ESLint turned on, which will provide errors and warnings as the code is written.
