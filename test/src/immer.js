const chai = require('chai');
const colors = require('colors');
const expect = chai.expect;
const produce = require('../../src/immer/immer.js');

describe('Immer', () => {
  it('normal produce', (done) => {
    const baseState = [
        {
            todo: "Learn typescript",
            done: true
        },
        {
            todo: "Try immer",
            done: false
        }
    ];

    const nextState = produce(baseState, draftState => {
        draftState.push({ todo: "Tweet about it" })
        draftState[1].done = true
    });
    
    expect(baseState.length).toBe(2)
    expect(nextState.length).toBe(3)

    // same for the changed 'done' prop
    expect(baseState[1].done).toBe(false)
    expect(nextState[1].done).toBe(true)

    // unchanged data is structurally shared
    expect(nextState[0]).toBe(baseState[0])
    // changed data not (dûh)
    expect(nextState[1]).not.toBe(baseState[1])
    done();
  });
});