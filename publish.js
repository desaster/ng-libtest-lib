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

// 0.0.1-20210906.ebaf822d
const dateString = (new Date).toISOString('en-US')
  .substring(0, 10)
  .replace(/-/g, '');
const uniqueVer = `${curVer}-${dateString}.g${commit}`;

process.chdir('./dist/ng-libtest-lib');

// use npm version to update package.json
cp.execSync(
  `npm version ${uniqueVer} --no-git-tag-version --allow-same-version`,
  { stdio: 'inherit' });

// publish and tag with commit id
cp.execSync(`npm publish --tag ${commit}`, {stdio: 'inherit'});
