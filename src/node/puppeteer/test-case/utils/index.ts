export const getArg = (arg: ICO): ICO => arg._.reduce((res: ICO, pre: string): ICO => {
  const [name, value] = pre.split('=');
  if (name) {
    res[name] = value;
  }
  return res;
}, {});
