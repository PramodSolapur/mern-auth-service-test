### Setup Nodejs Project Steps

[]  Git Setup
[]  Node Version Manager Setup
[]  Nodejs Project setup
[]  Typescript setup
[]  Prettier setup
[]  ESlint setup
[]  Git hooks setup
[]  Application config setup
[]  Express app setup
[]  Logger setup
[]  Error handling setup
[]  Tests setup
[]  Create template

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