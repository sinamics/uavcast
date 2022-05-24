const backendPackageJSON = require('./backend/package.json');
// const frontendPackageJSON = require('./frontend/package.json');

// Get all the top-level dependencies for the current project.
const dependencies = {
  ...backendPackageJSON.dependencies,
  ...backendPackageJSON.devDependencies
  //   ...frontendPackageJSON.dependencies,
  //   ...frontendPackageJSON.devDependencies
};

// Get the names of every dependency.
const dependencyNames = Object.keys(dependencies);

// Create a key => value of depenencyName => { license, whateverElse };
const licenses = dependencyNames.reduce((memo, dependencyName) => {
  const dependencyDirectory = `./backend/node_modules/${dependencyName}`;
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
