/**
 * Run this script from the root of the repo you want to inspect. It's assumed
 * that there's a `./node_modules` and `./package.json` where this script runs.
 */

const module = `backend`; // or frontend

const packageJSON = require(`./${module}/package.json`);

// Get all the top-level dependencies for the current project.
const dependencies = {
  ...packageJSON.dependencies,
  ...packageJSON.devDependencies
};

// Get the names of every dependency.
const dependencyNames = Object.keys(dependencies);

// Create a key => value of depenencyName => { license, whateverElse };
const licenses = dependencyNames.reduce((memo, dependencyName) => {
  const dependencyDirectory = `./${module}/${dependencyName}`;
  const dependencyPackageJSON = require(`${dependencyDirectory}/package.json`);
  const license = dependencyPackageJSON.license;

  return {
    ...memo,
    [dependencyName]: {
      dependencyName,
      license
    }
  };
}, {});

// Print out all the dependencies and their license info.
dependencyNames.sort().forEach((dependencyName) => {
  console.log(`"${dependencyName}","${licenses[dependencyName].license}"`);
});
