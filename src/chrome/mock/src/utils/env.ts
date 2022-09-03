export const isBrowser = typeof navigator !== 'undefined';
export const target: any = isBrowser
  ? window
  : typeof global !== 'undefined'
    ? global
    : {};