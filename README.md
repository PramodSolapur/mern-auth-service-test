### Setup Nodejs Project Steps

#### Git Setup

-   Initialize empty git repository

```sh
git init
```

-   Create .gitignore file to avoid pushing uneccessary files
-   Install gitignore vs code extension by CodeZombie
-   Press ctrl + shift + p, type add gitignore
-   Type Node then select Node.gitignore
-   Create a remote repository on github.com
-   Setup remote repo into your local
-   Push current code to main repo

#### Node Version Manager setup

-   Install nvm tool
-   Link to install nvm on windows https://github.com/coreybutler/nvm-windows/releases
-   Check nvm version

```sh
nvm -v
```

-   Check available node versions list

```sh
nvm list available
```

-   Check installed node versions in your system

```sh
nvm ls
nvm list
```

-   Install LTS node version

```sh
nvm install lts
```

-   Install Latest node version

```sh
nvm install latest
```

-   Install Specific node version

```sh
nvm install version
```

-   Use Specific node version

```sh
nvm use version
```

-   Create .nvmrc file in the root dir of your project and define the node version to work with

```.nvmrc
v22.10.0
```

-   Install specified version defined in .nvmrc file

```sh
nvm use
```

#### Nodej project Setup

-   Initialize node project

```sh
npm init
```

-   It will create package.json file
-   Create src folder

#### Typescript setup

-   Install typescript as dev dependency in your peoject

```sh
npm i -D typescript
```

-   In node_modules/bin you will see **tsc** that is typescript compiler and **tscserver** which gives auto-completion
-   Install nodejs types

```sh
npm i -D @types/node
```

-   Compile ts file

```sh
npx tsc fileName
```

-   To configure typescript, generate tsconfig.json file

```sh
npx tsc --init
```

-   Specify rootDir and outDir in tsconfig.json file

```tsconfig.json
rootDir: "./src",
outDir: "./dist"
```

-   This makes tsc read tsconfig.json and compile all files according to the settings (including outDir).

```sh
npx tsc
```

#### Prettier setup

-   Install prettier https://prettier.io/docs/install as a dev dependency

```sh
npm install --save-dev --save-exact prettier@3.0.3
```

-   Create .prettierrc file and add some configuration

```.prettierrc
{
  "singleQuote": true,
  "semi": false,
  "tabWidth": 4
}
```

-   Create .prettierignore file. By default it ignores build and coverage however we have created dist so change it from build to dist.

```sh
node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"
```

-   Install prettier vs code extension
-   Create two scripts

```package.json
"format:fix": "prettier . --write",
"format:check": "prettier . --check",
```

#### ESlint setup

-   ESLint is a tool for identifying and fixing problems in your JavaScript code, essential for maintaining code quality and consistency.
-   Configure typescript eslint https://typescript-eslint.io/getting-started/legacy-eslint-setup/
-   Install eslint and types as a dev dependency

```sh
npm install --save-dev eslint @eslint/js typescript-eslint
```

-   Next, create an eslint.config.mjs config file in the root of your project, and populate it with the following:

```eslint.config.mjs
// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
);
```

-   To avoid conflicts between prettier and eslint install

```sh
npm i -D eslint-config-prettier
```

-   Import and add config to eslint.cofnig.mjs file

```js
import eslintConfigPrettier from 'eslint-config-prettier/flat'
export default tseslint.config(someConfig, eslintConfigPrettier)
```

#### Git hooks / husky setup

-   Install husky package

```sh
npm install --save-dev husky
```

-   The init command simplifies setting up husky in a project.

```sh
npx husky init
```

-   It creates a pre-commit script in .husky/ and updates the prepare script in package.json. Modifications can be made later to suit your workflow.
-   Integrate huskywith eslint https://github.com/lint-staged/lint-staged

```sh
npm install --save-dev lint-staged # requires further setup
```

-   Add this block of code into package.json file

```json
"lint-staged": {
        "*.ts": [
            "npm run lint:fix",
            "npm run format:fix"
        ]
    }
```

-   Add below command to pre-commit husky file

```bash
npx lint-staged
```

[] Application config setup
[] Express app setup
[] Logger setup
[] Error handling setup
[] Tests setup
[] Create template
