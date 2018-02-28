const chai = require('chai');
const colors = require('colors');
const expect = chai.expect;
const produce = require('../../src/immer/immer.js');

describe('Immer', () => {
  it('normal produce', (done) => {
    const base = {
      a: {
        b: [{b1: 1}, {b2: 2},{b3: 3}],
      },
    };
    
    const res = produce(base, function(draft) {
      expect(draft.a).to.be.deep.equal({
        b: [{b1: 1}, {b2: 2},{b3: 3}],
      });
      expect(draft.a.b).to.be.deep.equal([{b1: 1}, {b2: 2},{b3: 3}]);
      expect(draft.a.b[0]).to.be.deep.equal({b1: 1});
      expect(draft.a.b[0].b1).to.be.equal(1);
      expect(draft.a.b[1]).to.be.deep.equal({b2: 2});
      expect(draft.a.b[1].b2).to.be.equal(2);
      draft.a.b[1].b2 = 100;
      expect(draft.a.b[1].b2).to.be.equal(100);
      draft.a.b[0] = 100;
    });
    done();
  });
});