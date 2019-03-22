import {Args as TypeScriptJsonSchemaArgs} from 'typescript-json-schema';
import Ajv = require('ajv');
export interface Options {
  schema: Pick<
    TypeScriptJsonSchemaArgs,
    Exclude<keyof TypeScriptJsonSchemaArgs, 'out'>
  >;
  ajv: Ajv.Options;
  useNamedExport: boolean;
}
export interface File {
  fileName: string;
  typeName?: string;
}
export interface ParsedArgs {
  files: File[];
  options: Options;
}
export declare function parseArgs(args?: string[]): ParsedArgs;
