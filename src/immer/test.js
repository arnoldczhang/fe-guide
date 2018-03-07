import produce from './immer';
// import produce from 'immer';

const byId = (state, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'aa':
        action.products.forEach(product => {
          draft[product.id] = product
        })
    }
  });


const state = {
  a: 1,
};

const action = {
  type: 'aa',
  products: [
    { id: 'a1', type: 'car', color: 'red' },
    { id: 'a2', type: 'bike', color: 'red2' },
    { id: 'a3', type: 'airplane', color: 'red3' },
  ],
};

const result = byId(state, action);
console.log(result.a1 === action.products[0]);
























// const baseState = [
//     {
//         todo: "Learn typescript",
//         done: true
//     },
//     {
//         todo: "Try immer",
//         done: false
//     }
// ];

// const nextState = produce(baseState, draftState => {
//     draftState.push({ todo: "Tweet about it" })
//     draftState[1].done = true
// });

// console.log(nextState, baseState);



// const arr = [{b1: 1}, {b2: 2},{b3: 3}];
// const base = {
//   a: {
//     b: arr,
//   },
// };

// const res = produce(base, function(draft) {
//   // console.log(draft.a);
//   // console.log(draft.a.b);
//   // console.log(draft.a.b[0]);
//   // console.log(draft.a.b[0].b1);
//   // console.log(draft.a.b[1]);
//   // console.log(draft.a.b[1].b2);
//   console.log(base);
//   draft.a.b[1].b2 = 101;
//   draft.a.b[0] = { b100: 100 };
//   draft.a.b[0].b100 = { b100: 100 };
//   // console.log(draft.a.b[1].b2);
//   // draft.a.b[0] = 100;
//   // draft.a.b[0]
//   // console.log(draft, this);
// });

// console.log(base, res);


// async function load() {
//   try {
//     return new Promise((resolve, reject) => {
//       // resolve(111);
//       throw new Error('');
//     });
//   } catch(err) {
//     console.log(err);
//   }
// };

// const res = await load();
// console.log(res);


// res({a: 1});
// res(1);
// res(1);


// const PROXY_STATE = Symbol('PROXY_STATE');
// const states = [];
// const cach = {};
// const base = {
//   array: [1, 2, 3],
// };

// const producer = function() {
//   // ...
// };

// const markChanged = (state) => {
//   state.modified = true;
//   if (state.parent) {
//     markChanges(state.parent);
//   }
// };

// const markChanges = () => {
//   states.forEach((state) => {
//     if (Array.isArray(state.base)) {
//       if(!shallowEqual(state.proxy, state.base)) {
//         markChanged(state);
//       }
//     } else if (Object.keys(state.proxy).length !== Object.keys(state.base).length) {
//       markChanged(state);
//     }
//   });
// };

// const finalize = (proxy) => {
//   if (proxy && proxy[PROXY_STATE]) {
//     if (proxy.modified) {
//       const state = proxy[PROXY_STATE];
//       if (state.finalized) {
//         return state.copy;
//       }
//       state.finalized = true;
//       state.copy = shallowCopy(proxy);
//       const base = state.base;
//       each(state.copy, (key, value) => {
//         if (value !== base[key]) {
//           copy[key] = finalize(value);
//         }
//       });
//       Object.freeze(copy);
//     } else {
//       return state.base;
//     }
//   }
//   aa: each(proxy, (index, child) => {
//     if (proxy && proxy[PROXY_STATE]) {
//       proxy[index] = finalize(child);
//     } else {
//       aa(child);
//     }
//   });
//   return proxy;
// };

// const prev = states;

// try{
//   // shallowCopy
//   const proxy = Object.assign({}, base);

//   // createPropertyProxy
//   Object.keys(base).forEach((key) => {
//     Object.defineProperty(proxy, key, cach[key] || {
//       configurable: true,
//       enumerable: true,
//       get() {
//           return get(this[PROXY_STATE], key)
//       },
//       set(value) {
//           set(this[PROXY_STATE], key, value)
//       }
//     });
//   });

//   // createState
//   const state = {
//     modified: false,
//     hasCopy: false,
//     parent: undefined,
//     base,
//     proxy,
//     copy: undefined,
//     finished: false,
//     finalizing: false,
//     finalized: false,
//   };

//   // createHiddenProperty
//   Object.defineProperty(proxy, PROXY_STATE, {
//     value: state,
//     enumerable: false,
//     writable: true
//   });
//   states.push(state);

//   const returnValue = producer.call(proxy, proxy);

//   states.forEach(state => state.finalizing = true);

//   markChanges();

//   result = finalize(proxy);

//   if (returnValue !== undefined && returnValue !== proxy) {
//     if (proxy[PROXY_STATE].modified) {
//       throw new Error('');
//     }
//     result = returnValue;
//   }

//   each(states, (i, state) => {
//     state.finished = true;
//   });
//   return result;
// } finally {
//   states = prev;
// }

// produce(state, (draft) => {
//   console.table(state);
//   console.table(draft);
// });
