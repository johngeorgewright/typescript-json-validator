'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
const tsconfig_1 = require('tsconfig');
function loadTsConfig(cwd) {
  const result = tsconfig_1.loadSync(cwd);
  const compilerOptions =
    (result.config && result.config.compilerOptions) || {};
  if (
    compilerOptions.experimentalDecorators === false &&
    compilerOptions.emitDecoratorMetadata === undefined
  ) {
    // typescript-json-schema sets emitDecoratorMetadata by default
    // we need to disable it if experimentalDecorators support is off
    compilerOptions.emitDecoratorMetadata = false;
  }
  return compilerOptions;
}
exports.default = loadTsConfig;
//# sourceMappingURL=loadTsConfig.js.map
