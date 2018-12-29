/**
 * Object.prototype.beDitto(schema)
 *
 * ditto - 百变怪
 * 
 */
const {
  prototype: arrayProto,
} = Array;

const {
  defineProperty,
  defineProperties,
  getPrototypeOf,
  setPrototypeOf,
  freeze,
  create,
  assign,
  prototype: ObjectProto,
} = Object;

const SCHEMA = 'schema';

const base = {};

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
  [Symbol.toStringTag]: {
    ...getProp,
    get() {
      return 'ditto';
    },
  },
  [Symbol.toPrimitive]: {
    ...baseProp,
    value: () => 0,
  },
  [Symbol.iterator]: {
    ...baseProp,
    value: function* iteratorGenerator() {
      yield* Array.from({ length: variableMax }).fill(ditto);
    },
  },
};

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
  entries: {
    ...baseProp,
    value: function* () {},
  },
  [SCHEMA]: {
    ...getProp,
    get() {
      return void 0;
    },
  },
}, baseSymbol));

const ditto = freeze(setPrototypeOf(base,
  new Proxy({}, {
    get(target, key, context, result = ditto) {
      if (key in arrayProto) {
        return () => ditto;
      }

      const { schema } = context;
      if (schema && Reflect.has(schema, key)) {
        result = valueOfKlass(Reflect.get(schema, key));
      }
      return result;
    },
    set() {
      return false;
    }
  })));

const isProto = (target, proto) => target === proto || getPrototypeOf(target) === proto;

const isEqual = (target, source) => target === source;

function* iteratorGenerator() {
  yield* Array.from({ length: variableMax }).fill(ditto);
};

function valueOfKlass(Klass, schema, result = new Klass) {
  if (isEqual(Klass, Object)) {
    return getDitto(schema);
  }
  return result.valueOf();
};

function getDitto(schema, result = ditto) {
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
      let value = Reflect.get(target, key);
      const thisType = Reflect.get(schema || {}, key);
      if (isEqual(value, void 0)) {
        value = thisType ? valueOfKlass(thisType, schema) : getDitto(schema);
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
    return dittoWrapper(this, schema);
  },
});

module.exports = {
  ditto,
  variableMax,
};
