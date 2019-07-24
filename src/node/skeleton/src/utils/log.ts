import * as signale from 'signale';

const { Signale } = signale;

const instance = new Signale({ interactive: true, scope: '^_^' });

let length: number;

let index: number = 1;

const Logger = {
  getInstance() {
    return {
      error: signale.fatal,
      warn: signale.warn,
      await(word: string) {
        instance.pending(`[%d/${length}] - ${word}`, index);
      },

      success(word: string) {
        instance.success(`[%d/${length}] - ${word}`, index++);
      },
    };
  },
};

export const init = (pages: string[]): void => {
  length = pages.length;
};

export default Logger;
