/**
 * Object.prototype.beSmart(schema)
 */
const baseObject = {};

const variableMax = 10;

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
  prototype: ObjectProto,
} = Object;

const baseProp = {
  enumerable: false,
  configurable: false,
  writable: false,
};

defineProperties(baseObject, {
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
  [Symbol.toPrimitive]: {
    ...baseProp,
    value: () => 0,
  },
  [Symbol.iterator]: {
    ...baseProp,
    value: function* () {
      yield* Array.from({ length: variableMax }).fill(smartObject);
    },
  }
});

const smartObject = freeze(setPrototypeOf(baseObject,
  new Proxy({}, {
    get(target, key, context, result = smartObject) {
      if (key in arrayProto) {
        return () => smartObject;
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

freeze(baseObject);

const isProto = (target, proto) => target === proto || getPrototypeOf(target) === proto;

const isEqual = (target, source) => target === source;

function valueOfKlass(Klass, schema, result = new Klass) {
  if (isEqual(Klass, Object)) {
    return getSmartObject(schema);
  }
  return result.valueOf();
};

function getSmartObject(schema, result = smartObject) {
  if (isEqual(typeof schema, 'object')) {
    result = create(result);
    defineProperty(result, 'schema', {
      ...baseProp,
      value: schema,
    });
  }
  return result;
};

function smartWrapper(inst, schema) {
  return new Proxy(inst, {
    get(target, key) {
      let value = Reflect.get(target, key);
      const thisType = Reflect.get(schema, key);
      if (isEqual(value, void 0)) {
        value = thisType ? valueOfKlass(thisType, schema) : getSmartObject(schema);
      }
      return value;  
    },
  });
};

defineProperty(ObjectProto, 'beSmart', {
  ...baseProp,
  value(schema = {}) {
    debugger;
    try {
      if (isProto(this, smartObject)) {
        return this;
      }
      return smartWrapper(this, schema);
    } catch(err) {
      console.log('rrr');
    }
  },
});

module.exports = {
  smartObject,
};

// const obj = {
//       a: 1,
//       b: 2,
//       z: {aaaa: 1},
//     };
//     const {
//       a,
//       b,
//       c: {
//         d,
//         e,
//         f: [i, j, k],
//         l,
//         cc,
//       },
//       z,
//     } = obj.beSmart({
//       d: Array,
//       c: Object,
//       cc: Object,
//     });