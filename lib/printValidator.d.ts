import Ajv = require('ajv');
import * as TJS from 'typescript-json-schema';
export declare function printTypeCollectionValidator(
  symbols: string[],
  schema: TJS.Definition,
  relativePath: string,
  options?: Ajv.Options,
): string;
export declare function printSingleTypeValidator(
  typeName: string,
  isNamedExport: boolean,
  schema: TJS.Definition,
  relativePath: string,
  options?: Ajv.Options,
): string;
