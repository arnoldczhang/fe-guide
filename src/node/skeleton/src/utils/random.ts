export const to36 = (num: number = Math.random()): string => num.toString(36).slice(2);

export const genKlass = (num: number = Math.random()): string[] => {
  let klass = to36();
  if (!isNaN(Number(klass[0]))) {
    klass = (Number(klass[0]) - -10).toString(36) + klass.slice(1);
  }
  return [klass, `.${klass}`];
};
