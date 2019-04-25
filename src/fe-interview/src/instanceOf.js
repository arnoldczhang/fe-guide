
/**
 * [instanceOf description]
 * @param  {[type]} target [description]
 * @param  {[type]} proto  [description]
 * @return {[type]}        [description]
 */
function instanceOf(target, Klass) {
  const { __proto__ } = target;
  const { prototype } = Klass;
  while (true) {
    if (__proto__ === null) return false;
    if (__proto__ === prototype) return true;
    __proto__ = __proto__.__proto__;
  }
};

// test
// console.log(instanceOf({}, Object));
