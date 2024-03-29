/**
 * Object.prototype.beDitto(schema)
 *
 * ditto - 百变怪
 * 
 */
const {
  prototype: ArrayProto,
} = Array;

const {
  get,
  set,
  has,
  defineProperty,
  getPrototypeOf,
  setPrototypeOf,
} = Reflect;

const {
  defineProperties,
  freeze,
  create,
  assign,
  prototype: ObjectProto,
} = Object;

let cachSchema = new Map;

const SCHEMA = 'schema';

const variableMax = 10;

const getProp = {
  enumerable: false,
  configurable: false,
};

const baseProp = {
  ...getProp,
  writable: false,
};

const baseSymbol = {
  entries: {
    ...baseProp,
    value: function* () {},
  },
  [Symbol.toStringTag]: {
    ...getProp,
    get() {
      return 'Ditto';
    },
  },
  [Symbol.toPrimitive]: {
    ...baseProp,
    value: () => 0,
  },
  [Symbol.iterator]: {
    ...baseProp,
    value: iteratorGenerator,
  },
};

const ditto = freeze(dittoGen());

const isProto = (target, proto) => target === proto || getPrototypeOf(target) === proto;
const isSelfExecute = key => ['toString', 'toLocaleString'].indexOf(key) > -1;
const isEqual = (target, source) => target === source;
const clearCachLater = () => setTimeout(() => cachSchema.clear());

function dittoGen() {
  const base = {};

  defineProperties(base, assign({
    length: {
      ...baseProp,
      value: 0,
    },
    valueOf: {
      ...baseProp,
      value: false,
    },
    toString: {
      ...baseProp,
      value: false,
    },
    [SCHEMA]: {
      ...getProp,
      get() {
        return void 0;
      },
    },
  }, baseSymbol));

  setPrototypeOf(base,
    new Proxy({}, {
      get(target, key, context, result = ditto) {
        if (key in ArrayProto) {
          return dittoFunc(key);
        }

        const { schema = cachSchema.get(SCHEMA) } = context;
        if (schema && has(schema, key)) {
          result = valueOfKlass(get(schema, key));
        }
        return result;
      },
      set() {
        return false;
      }
    }));
  return base;
};

function dittoFunc(key) {
  if (isSelfExecute(key)) {
    return () => ObjectProto[key].call(ditto);
  }
  return () => ditto;
};

function* iteratorGenerator() {
  yield* Array.from({ length: variableMax }).fill(ditto);
};

function valueOfKlass(Klass, schema, result) {
  try {
    result = new Klass;
  } catch(err) {
    console.warn(`${Klass} - is not a constructorrrr!!!`);
    return getDitto(schema);
  }

  if (isEqual(Klass, Object)) {
    return getDitto(schema);
  }
  return result.valueOf();
};

function getDitto(schema, key, result = ditto) {
  if (key in ArrayProto) {
    return dittoFunc(key);
  }

  if (isEqual(typeof schema, 'object')) {
    result = create(result);
    defineProperty(result, SCHEMA, {
      ...baseProp,
      value: schema,
    });
  }
  return result;
};

function dittoWrapper(inst, schema) {
  return create(new Proxy(inst, {
    get(target, key) {
      let value = get(target, key);
      const thisType = get(schema || {}, key);
      if (isEqual(value, void 0)) {
        value = thisType ? valueOfKlass(thisType, schema) : getDitto(schema, key);
      }
      return value;  
    },
  }), baseSymbol);
};

defineProperty(ObjectProto, 'beDitto', {
  ...baseProp,
  value(schema) {
    if (isProto(this, ditto)) {
      return this;
    }
    cachSchema.set(SCHEMA, schema);
    const result = dittoWrapper(this, schema);
    clearCachLater(this);
    return result;
  },
});

module.exports = {
  ditto,
  variableMax,
};
