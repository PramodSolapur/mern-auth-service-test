### Setup Nodejs Project Steps


#### Git Setup

- Initialize empty git repository
```sh
git init
```
- Create .gitignore file to avoid pushing uneccessary files
- Install gitignore vs code extension by CodeZombie
- Press ctrl + shift + p, type add gitignore
- Type Node then select Node.gitignore
- Create a remote repository on github.com
- Setup remote repo into your local
- Push current code to main repo


#### Node Version Manager setup

- Install nvm tool
- Link to install nvm on windows https://github.com/coreybutler/nvm-windows/releases
- Check nvm version
```sh
nvm -v
```
- Check available node versions list
```sh
nvm list available
```
- Check installed node versions in your system
```sh
nvm ls
nvm list
```
- Install LTS node version
```sh
nvm install lts
```
- Install Latest node version
```sh
nvm install latest
```
- Install Specific node version
```sh
nvm install version
```
- Use Specific node version
```sh
nvm use version
```
- Create .nvmrc file in the root dir of your project and define the node version to work with
```.nvmrc
v22.10.0
```
- Install specified version defined in .nvmrc file
```sh
nvm use
```

#### Nodej project Setup

- Initialize node project
```sh
npm init
```
- It will create package.json file
- Create src folder


#### Typescript setup

- Install typescript as dev dependency in your peoject
```sh
npm i -D typescript
```
- In node_modules/bin you will see **tsc** that is typescript compiler and **tscserver** which gives auto-completion
- Install nodejs types
```sh
npm i -D @types/node  
```
- Compile ts file
```sh
npx tsc fileName
```
- To configure typescript, generate tsconfig.json file
```sh
npx tsc --init
```
- Specify rootDir and outDir in tsconfig.json file
```tsconfig.json
rootDir: "./src",
outDir: "./dist"
```
- This makes tsc read tsconfig.json and compile all files according to the settings (including outDir).
```sh
npx tsc
``` 



[]  Prettier setup
[]  ESlint setup
[]  Git hooks setup
[]  Application config setup
[]  Express app setup
[]  Logger setup
[]  Error handling setup
[]  Tests setup
[]  Create template