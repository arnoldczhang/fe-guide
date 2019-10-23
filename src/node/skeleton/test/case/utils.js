const {
  test
} = require('../../dist/index.cjs');
const chai = require('chai');
const expect = chai.expect;

describe('utils', () => {
  it('getRelativePath', (done) => {
    expect(test.getRelativePath('a/b.js', 'a/c.js')).to.be.equal('./b.js');
    expect(test.getRelativePath('a/b/c.js', 'a/c.js')).to.be.equal('./b/c.js');
    expect(test.getRelativePath('a/b/c/d.js', 'a/c.js')).to.be.equal('./b/c/d.js');
    expect(test.getRelativePath('b/c/d.js', 'a/c.js')).to.be.equal('../b/c/d.js');
    expect(test.getRelativePath('/c/b.js', 'a/c.js')).to.be.equal('../c/b.js');
    expect(test.getRelativePath('c/b.js', 'a/c.js')).to.be.equal('../c/b.js');
    expect(test.getRelativePath('../b/c/d.js', 'a/c.js')).to.be.equal('../../b/c/d.js');
    done();
  });
});
