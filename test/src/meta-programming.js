const { ditto, variableMax } = require('../../src/meta-programming/index.js');
const chai = require('chai');
const colors = require('colors');
const expect = chai.expect;

describe('meta-programming', () => {
  it('who am I', (done) => {
    const obj = {
      a: 1,
      b: 2,
    };
    const dittoOne = obj.beDitto();
    expect(dittoOne.toString()).to.be.equal('[object Ditto]');
    expect(dittoOne.toLocaleString()).to.be.equal('[object Ditto]');
    done();
  });

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
    } = obj.beDitto();
    expect(a).to.be.equal(1);
    expect(b).to.be.equal(2);
    expect(d).to.be.equal(ditto);
    done();
  });

  it('with schema variable1', (done) => {
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
    } = obj.beDitto({
      d: Boolean,
    });
    expect(a).to.be.equal(1);
    expect(b).to.be.equal(2);
    expect(d).to.be.equal(false);
    done();
  });

  it('with schema variable2', (done) => {
    const obj = {
      a: 1,
      b: 2,
    };
    
    const {
      a,
      b,
      c,
      dd: {
        d,
      },
      e,
      f,
      ggg: {
        gg: {
          g,
        },
      },
      hhhh: {
        hhh: {
          hh: {
            h,
          },
        },
      },
      i,
      j,
    } = obj.beDitto({
      c: Boolean,
      d: Map,
      e: Set,
      f: Number,
      g: String,
      h: Symbol,
      i: WeakSet,
      j: WeakMap,
    });
    expect(a).to.be.equal(1);
    expect(b).to.be.equal(2);
    expect(c).to.be.equal(false);
    expect(d).to.be.deep.equal(new Map);
    expect(e).to.be.deep.equal(new Set);
    expect(f).to.be.equal(0);
    expect(g).to.be.equal('');
    expect(h).to.be.deep.equal(ditto);
    expect(i).to.be.deep.equal(new WeakSet);
    expect(j).to.be.deep.equal(new WeakMap);
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
    } = obj.beDitto({
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
    expect(i).to.be.equal(ditto);
    expect(j).to.be.equal(ditto);
    expect(k).to.be.equal(ditto);
    expect(f).to.be.equal(ditto);
    expect(g).to.be.equal(ditto);
    expect(h).to.be.equal(ditto);
    expect(ccc).to.be.equal(ditto);
    expect(args.length).to.be.deep.equal(variableMax);
    expect(args[0]).to.be.deep.equal(ditto);
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
    } = obj.beDitto({
      d: Array,
      c: Object,
      cc: Object,
    });

    expect(a).to.be.equal(1);
    expect(b).to.be.equal(2);
    expect(d).to.be.deep.equal([]);
    expect(i).to.be.equal(ditto);
    expect(j).to.be.equal(ditto);
    expect(e).to.be.equal(ditto);
    expect(l).to.be.equal(ditto);
    expect(k).to.be.equal(ditto);
    expect(cc).to.be.equal(ditto);
    expect(z).to.be.deep.equal({ aaaa: 1 });
    done();
  });

  it('use iterator variable3', (done) => {
    const obj = {
      a: [],
      b: 2,
    };
    const [ a, b, c ] = obj.beDitto();
    a.forEach();
    a.map(() => {});
    a.some(() => {});
    a.filter(() => {});
    a.reduce(() => {});
    c.forEach();
    c.map(() => {});
    c.some(() => {});
    c.filter(() => {});
    c.reduce(() => {});
    a.b.b.b.b.b.b.g.b.b.b;
    b.b.c.h.b.z.b.b.b.b.b;
    c.b.b.b.b.b.b.b.d.b.b;

    const { a: aa, b: bb, c: cc } = obj.beDitto();
    expect(bb).to.be.equal(2);
    expect(aa).to.be.deep.equal([]);
    expect(cc).to.be.deep.equal(ditto);
    cc[10000][1][2][3][4][5];

    const aaa = obj.beDitto().a;
    const ccc = obj.beDitto().c;
    const ddd = obj.beDitto().d;
    ccc.forEach();
    ccc.map(() => {});
    ccc.some(() => {});
    ccc.filter(() => {});
    ccc.reduce(() => {});
    ccc.b.b.b.b.b.b.b.d.b.b;
    ddd.b.c.h.b.z.b.b.b.b.b;
    expect(aaa).to.be.deep.equal([]);
    ccc[10000][1][2][3][4][5];
    ddd[10000][1][2][3][4][5];

    const aaaa = obj.beDitto()[10];
    const bbbb = obj.beDitto()[222];
    const cccc = obj.beDitto()[3333];
    aaaa.b.b.b.b.b.b.g.b.b.b;
    bbbb.b.c.h.b.z.b.b.b.b.b;
    cccc.b.b.b.b.b.b.b.d.b.b;
    cccc.forEach();
    cccc.map(() => {});
    cccc.some(() => {});
    cccc.filter(() => {});
    cccc.reduce(() => {});
    aaaa[10000].b.a.c[1][2][3][4][5];
    bbbb[10000][1][2].b.a.c[3][4][5];
    cccc[10000][1][2][3][4].b.a.c[5];

    const [ aaaaa ] = aaaa[10000].b.a.c[1][2][3][4][5];
    const { bbbbb, c: [ ccccc ] } = bbbb[10000][1][2].b.a.c[3][4][5];

    aaaaa.b[2][3][4].c.h.b.z.b.b.b.b.b;
    bbbbb.b.b.b.b[2][3][4].b.b.g.b.b.b;
    ccccc.b.c.h.b.z.b.b.b.b[2][3][4].b;
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
    } = obj.beDitto({
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
    expect(k).to.be.equal(ditto);
    obj.beDitto().aa.a.a;
    done();
  });

  it('method test2', (done) => {
    const obj = {
      a: 1,
      b: 2,
    };

    obj.beDitto().forEach(() => {});
    obj.beDitto().map(() => {});
    obj.beDitto().some(() => {});
    obj.beDitto().filter(() => {});
    obj.beDitto().reduce(() => {});
    for (let key of obj.beDitto().entries()) {
      expect(false).to.be.equal(true);
    }
    done();
  });
});