import * as TJS from 'typescript-json-schema';
export default function parse(
  filenames: string[],
  settings?: TJS.PartialArgs,
): {
  getAllTypes(
    includeReffedDefinitions?: boolean,
    ...fns: string[]
  ): {
    symbols: string[];
    schema: TJS.Definition;
  };
  getType(name: string): TJS.Definition;
};
