'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
const fs_1 = require('fs');
const child_process_1 = require('child_process');
const DELIMITER = '<!-- USAGE -->';
const README = fs_1.readFileSync('README.md', 'utf8').split(DELIMITER);
const result = child_process_1.spawnSync('node', [
  __dirname + '/cli',
  '--help',
]);
if (result.error) {
  throw result.error;
}
if (result.status !== 0) {
  throw new Error('cli --help exited with non zero code');
}
README[1] = '\n```\n' + result.stdout.toString() + '\n```\n';
fs_1.writeFileSync('README.md', README.join(DELIMITER));
//# sourceMappingURL=usage.js.map
