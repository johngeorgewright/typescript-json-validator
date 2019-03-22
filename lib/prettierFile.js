'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
const cross_spawn_1 = require('cross-spawn');
let prettierPath = undefined;
try {
  prettierPath = require.resolve('.bin/prettier');
} catch (ex) {}
function prettierFile(fileName) {
  if (prettierPath) {
    cross_spawn_1.sync(prettierPath, [fileName, '--write']);
  }
}
exports.default = prettierFile;
//# sourceMappingURL=prettierFile.js.map
