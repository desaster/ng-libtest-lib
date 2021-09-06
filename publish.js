//
// https://newbedev.com/how-to-publish-an-npm-package-from-the-ci-build-pipeline-and-still-automate-versioning
//

const cp = require('child_process');

// get current semver version without prerelease suffix
const pkg = require('./dist/ng-libtest-lib/package.json');
const curVer = pkg.version.trim().split(/[.-]/).slice(0, 3).join('.');

// get the commit id
const commit = cp.execSync('git rev-parse --short HEAD', {encoding: 'utf-8'}).trim();
console.log(`Package: ${pkg.name}, version: ${curVer}, commit: ${commit}`);

// generate a new unique semver-compliant version based the commit it and current time
const uniqueVer = `${curVer}-alpha-${commit}-${Math.random().toFixed(8).substr(2)}.${Date.now()}`;

// const uniqueVer = `${curVer}-alpha-${commit}`;
process.chdir('./dist/ng-libtest-lib');

// use npm version to update package.json
cp.execSync(
  `npm version ${uniqueVer} --no-git-tag-version --allow-same-version`,
  { stdio: 'inherit' });

// publish and tag with commit id
cp.execSync(`npm publish --tag ${commit}`, {stdio: 'inherit'});
