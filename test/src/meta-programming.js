const { smartObject } = require('../../src/meta-programming/index.js');
const chai = require('chai');
const colors = require('colors');
const expect = chai.expect;

describe('meta-programming', () => {
  it('normal variable', (done) => {
    const obj = {
      a: 1,
      b: 2,
    };
    
    const {
      a,
      b,
      c: {
        d,
      },
    } = obj.beSmart();
    expect(a).to.be.equal(1);
    expect(b).to.be.equal(2);
    expect(d).to.be.equal(smartObject);
    done();
  });

  it('with schema variable', (done) => {
    const obj = {
      a: 1,
      b: 2,
    };
    
    const {
      a,
      b,
      c: {
        d,
      },
    } = obj.beSmart({
      d: Boolean,
    });
    expect(a).to.be.equal(1);
    expect(b).to.be.equal(2);
    expect(d).to.be.equal(false);
    done();
  });

  it('use iterator variable1', (done) => {
    const obj = {
      a: 1,
      b: 2,
    };
    
    const {
      a,
      b,
      c: {
        d,
        e,
        f: [i, j, k],
        l,
        c: ccc,
      },
    } = obj.beSmart({
      d: Array,
    });

    const [f, g, h] = e;
    const [...args] = l;

    for (let key of e.entries()) {
      expect(false).to.be.equal(true);
    }
    expect(a).to.be.equal(1);
    expect(b).to.be.equal(2);
    expect(d).to.be.deep.equal([]);
    expect(i).to.be.equal(smartObject);
    expect(j).to.be.equal(smartObject);
    expect(k).to.be.equal(smartObject);
    expect(f).to.be.equal(smartObject);
    expect(g).to.be.equal(smartObject);
    expect(h).to.be.equal(smartObject);
    expect(ccc).to.be.equal(smartObject);
    done();
  });

  it('use iterator variable2', (done) => {
    const obj = {
      a: 1,
      b: 2,
      z: {aaaa: 1},
    };
    const {
      a,
      b,
      c: {
        d,
        e,
        f: [i, j, k],
        l,
        cc,
      },
      z,
    } = obj.beSmart({
      d: Array,
      c: Object,
      cc: Object,
    });

    expect(a).to.be.equal(1);
    expect(b).to.be.equal(2);
    expect(d).to.be.deep.equal([]);
    expect(i).to.be.equal(smartObject);
    expect(j).to.be.equal(smartObject);
    expect(cc).to.be.deep.equal({});
    expect(z).to.be.deep.equal({ aaaa: 1});
    done();
  });

  it('method test', (done) => {
    const obj = {
      a: 1,
      b: 2,
    };
    
    const {
      a,
      b,
      c: {
        d,
        e,
      },
    } = obj.beSmart({
      d: Array,
    });
    for(let et of d.entries()) {}
    for(let et of e.entries()) {}
    e.forEach(() => {});
    e.map(() => {});
    e.some(() => {});
    e.filter(() => {});
    e.reduce(() => {});
    const [f, g, h] = e;
    done();
  });

});