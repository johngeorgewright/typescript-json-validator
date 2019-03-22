'use strict';
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', {value: true});
const t = __importStar(require('./template'));
function isKoaType(typeDefinition) {
  return (
    typeDefinition &&
    typeDefinition.properties &&
    KoaProperties.some(property => property in typeDefinition.properties) &&
    Object.keys(typeDefinition.properties).every(property =>
      KoaProperties.includes(property),
    )
  );
}
const KoaProperties = ['params', 'query', 'body'];
function printTypeCollectionValidator(
  symbols,
  schema,
  relativePath,
  options = {},
) {
  const koaTypes = symbols.filter(typeName => {
    return isKoaType(schema.definitions && schema.definitions[typeName]);
  });
  return [
    t.IMPORT_AJV,
    ...(koaTypes.length ? [t.IMPORT_KOA_CONTEXT, t.IMPORT_INSPECT] : []),
    t.importNamedTypes(symbols, relativePath),
    t.declareAJV(options),
    t.exportNamed(symbols),
    t.declareSchema('Schema', schema),
    t.addSchema('Schema'),
    ...koaTypes.map(s => t.validateKoaRequestOverload(s, schema)),
    ...(koaTypes.length
      ? [t.VALIDATE_KOA_REQUEST_FALLBACK, t.VALIDATE_KOA_REQUEST_IMPLEMENTATION]
      : []),
    ...symbols.map(s => t.validateOverload(s)),
    t.VALIDATE_IMPLEMENTATION,
  ].join('\n');
}
exports.printTypeCollectionValidator = printTypeCollectionValidator;
function printSingleTypeValidator(
  typeName,
  isNamedExport,
  schema,
  relativePath,
  options = {},
) {
  if (isNamedExport !== false) {
    throw new Error('temp');
  }
  return [
    t.IMPORT_INSPECT,
    t.IMPORT_AJV,
    t.importType(typeName, relativePath, {isNamedExport}),
    t.declareAJV(options),
    t.exportNamed([typeName]),
    t.declareSchema(typeName + 'Schema', schema),
    // TODO: koa implementation
    t.DECLARE_VALIDATE_TYPE,
    t.validateFn(typeName, typeName + 'Schema'),
  ].join('\n');
}
exports.printSingleTypeValidator = printSingleTypeValidator;
//# sourceMappingURL=printValidator.js.map
