'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
const stringify = require('json-stable-stringify');
exports.IMPORT_INSPECT = `import {inspect} from 'util';`;
exports.IMPORT_AJV = `import Ajv = require('ajv');`;
exports.IMPORT_KOA_CONTEXT = `import {Context} from 'koa';`;
exports.importNamedTypes = (names, relativePath) =>
  `import {${names.join(', ')}} from '${relativePath}';`;
exports.importDefaultType = (name, relativePath) =>
  `import ${name} from '${relativePath}';`;
exports.importType = (name, relativePath, {isNamedExport}) =>
  isNamedExport
    ? exports.importNamedTypes([name], relativePath)
    : exports.importDefaultType(name, relativePath);
exports.declareAJV = options => `export const ajv = new Ajv(${stringify(
  Object.assign({coerceTypes: false, allErrors: true}, options),
)});

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
`;
exports.exportNamed = names => `export {${names.join(', ')}};`;
exports.declareSchema = (name, schema) =>
  `export const ${name} = ${stringify(schema, {space: 2})};`;
exports.addSchema = name => `ajv.addSchema(${name}, '${name}')`;
exports.DECLARE_VALIDATE_TYPE = `export type ValidateFunction<T> = ((data: unknown) => data is T) & Pick<Ajv.ValidateFunction, 'errors'>`;
exports.validateType = typeName => `ValidateFunction<${typeName}>`;
exports.compileSchema = (schemaName, typeName) =>
  `ajv.compile(${schemaName}) as ${exports.validateType(typeName)}`;
exports.validateFn = (
  typeName,
  schemaName,
) => `const rawValidate${typeName} = ${exports.compileSchema(
  schemaName,
  typeName,
)};
export default function validate(value: unknown): ${typeName} {
  if (rawValidate${typeName}(value)) {
    return value;
  } else {
    throw new Error(
      ajv.errorsText(rawValidate${typeName}.errors, {dataVar: '${typeName}'}) +
      '\\n\\n' +
      inspect(value),
    );
  }
}`;
function typeOf(typeName, property, schema) {
  if (schema.definitions && schema.definitions[typeName]) {
    const typeSchema = schema.definitions[typeName];
    if (
      typeSchema.properties &&
      Object.keys(typeSchema.properties).includes(property)
    ) {
      return `${typeName}['${property}']`;
    }
  }
  return 'unknown';
}
exports.validateKoaRequestOverload = (
  typeName,
  schema,
) => `export function validateKoaRequest(typeName: '${typeName}'): (ctx: Context) => {
  params: ${typeOf(typeName, 'params', schema)},
  query: ${typeOf(typeName, 'query', schema)},
  body: ${typeOf(typeName, 'body', schema)},
};`;
exports.VALIDATE_KOA_REQUEST_FALLBACK = `export function validateKoaRequest(typeName: string): (ctx: Context) => {
  params: unknown,
  query: unknown,
  body: unknown,
};`;
exports.VALIDATE_KOA_REQUEST_IMPLEMENTATION = `export function validateKoaRequest(typeName: string): (ctx: Context) => {
  params: any,
  query: any,
  body: any,
} {
  const params = ajv.getSchema(\`Schema#/definitions/\${typeName}/properties/params\`);
  const query = ajv.getSchema(\`Schema#/definitions/\${typeName}/properties/query\`);
  const body = ajv.getSchema(\`Schema#/definitions/\${typeName}/properties/body\`);
  const validateProperty = (
    prop: string,
    validator: any,
    ctx: Context,
  ): any => {
    const data = prop === 'body' ? ctx.request && (ctx.request as any).body : (ctx as any)[prop];
    if (validator) {
      const valid = validator(data);
  
      if (!valid) {
        ctx.throw(
          400,
          'Invalid request: ' + ajv.errorsText(validator.errors, {dataVar: prop}) + '\\n\\n' + inspect({params: ctx.params, query: ctx.query, body: ctx.body}),
        );
      }
    }
    return data;
  };
  return (ctx) => {
    return {
      params: validateProperty('params', params, ctx),
      query: validateProperty('query', query, ctx),
      body: validateProperty('body', body, ctx),
    }
  };
}`;
exports.validateOverload = typeName =>
  `export function validate(typeName: '${typeName}'): (value: unknown) => ${typeName};`;
exports.VALIDATE_IMPLEMENTATION = `export function validate(typeName: string): (value: unknown) => any {
  const validator: any = ajv.getSchema(\`Schema#/definitions/\${typeName}\`);
  return (value: unknown): any => {
    if (!validator) {
      throw new Error(\`No validator defined for Schema#/definitions/\${typeName}\`)
    }
  
    const valid = validator(value);

    if (!valid) {
      throw new Error(
        'Invalid ' + typeName + ': ' + ajv.errorsText(validator.errors, {dataVar: typeName}),
      );
    }

    return value as any;
  };
}`;
//# sourceMappingURL=template.js.map
