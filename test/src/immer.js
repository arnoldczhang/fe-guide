const chai = require('chai');
const colors = require('colors');
const expect = chai.expect;
const produce = require('../../src/immer/immer.js');

describe('Immer', () => {
/*
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
    
    expect(baseState.length).to.be.equal(2)
    expect(nextState.length).to.be.equal(3)

    // same for the changed 'done' prop
    expect(baseState[1].done).to.be.equal(false)
    expect(nextState[1].done).to.be.equal(true)

    // unchanged data is structurally shared
    expect(nextState[0]).to.be.deep.equal(baseState[0])
    // changed data not (dûh)
    expect(nextState[1]).to.not.equal(baseState[1])
    done();
  });

  it('reducer produce', (done) => {
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

    const products = action.products;

    const result = byId(state, action);

    expect(result).to.be.deep.equal({
        a: 1,
        a1: products[0],
        a2: products[1],
        a3: products[2],
    });
    expect(result.a1).to.be.equal(products[0]);
    expect(result.a2).to.be.equal(products[1]);
    expect(result.a3).to.be.equal(products[2]);
    done();
  });

  it('setState', (done) => {
    const callback = produce(draft => {
      draft.user.age += 1
    });

    const state = {
      user: {
        age: 100,
        name: 'aa',
      },
    };

    const result = callback(state);
    expect(result).to.be.deep.equal({
      user: {
        age: 101,
        name: 'aa',
      },
    });
    expect(state).to.be.deep.equal({
      user: {
        age: 100,
        name: 'aa',
      },
    });
    done();
  });

  it('curry', (done) => {
    const mapper = produce((draft, index) => {
        draft.index = index;
    });

    // example usage
    expect([{}, {}, {}].map(mapper)).to.be.deep.equal([
        { index: 0 },
        { index: 1 },
        { index: 2 },
    ]);

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

    const products = action.products;

    const byId = produce((draft, action) => {
      switch (action.type) {
        case 'aa':
          action.products.forEach(product => {
            draft[product.id] = product
          })
      }
    });

    const result = byId(state, action);

    expect(result).to.be.deep.equal({
        a: 1,
        a1: products[0],
        a2: products[1],
        a3: products[2],
    });
    expect(result.a1).to.be.equal(products[0]);
    expect(result.a2).to.be.equal(products[1]);
    expect(result.a3).to.be.equal(products[2]);
    done();
  });

  it('this', (done) => {
    const base = { counter: 0 };

    const next = produce(base, function() {
      this.counter++;
    });

    expect(next).to.be.deep.equal({
        counter: 1,
    });
    expect(base).to.be.deep.equal({
        counter: 0,
    });
    done();
  });
*/
});