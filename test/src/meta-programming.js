const { smartObject, variableMax } = require('../../src/meta-programming/index.js');
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
    expect(args.length).to.be.deep.equal(variableMax);
    expect(args[0]).to.be.deep.equal(smartObject);
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
    expect(e).to.be.equal(smartObject);
    expect(l).to.be.equal(smartObject);
    expect(k).to.be.equal(smartObject);
    expect(cc).to.be.equal(smartObject);
    expect(z).to.be.deep.equal({ aaaa: 1 });
    done();
  });

  it('method test', (done) => {
    const obj = {
      a: 1,
      b: 2,
    };
    
    const {
      c: {
        d,
        e,
        f: [i, j, k],
      },
    } = obj.beSmart({
      d: Array,
    });
    for(let et of d.entries()) {
      expect(false).to.be.equal(true);  
    }
    for(let et of e.entries()) {
      expect(false).to.be.equal(true);
    }
    for(let et of j.entries()) {
      expect(false).to.be.equal(true);
    }
    e.forEach(() => {});
    e.map(() => {});
    e.some(() => {});
    e.filter(() => {});
    e.reduce(() => {});
    
    const [f, g] = e;
    for(let et of g.entries()) {
      expect(false).to.be.equal(true);
    }
    f.forEach(() => {});
    f.map(() => {});
    f.some(() => {});
    f.filter(() => {});
    f.reduce(() => {});
    
    i.forEach(() => {});
    i.map(() => {});
    i.some(() => {});
    i.filter(() => {});
    i.reduce(() => {});
    expect(k).to.be.equal(smartObject);
    obj.beSmart().aa.a.a;
    done();
  });

});