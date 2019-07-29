const {
  test
} = require('../../dist/index.cjs');
const chai = require('chai');
const expect = chai.expect;

describe('wxss', () => {
  it('wxss【按自定义组件规则】过滤', (done) => {
    const options = {
      wxmlKlassInfo: {
        '#abc': '.aabbss',
      },
    };

    expect(test.filterUsableSelectors([
      '.page-container #abc',
      '.page-container#abc.cc ',
    ], options)).to.be.deep.equal([true, [
      '.page-container .aabbss',
      '.page-container.aabbss.cc',
    ]]);

    expect(test.filterUsableSelectors([
      '.page-container #abc .cc',
    ], options)).to.be.deep.equal([true, [
      '.page-container .aabbss .cc',
    ]]);

    expect(test.filterUsableSelectors([
      '#abc .page-container',
    ], options)).to.be.deep.equal([true, [
      '.aabbss .page-container',
    ]]);

    expect(test.filterUsableSelectors([
      '#abc view .page-container',
    ], options)).to.be.deep.equal([true, [
      '.aabbss view .page-container',
    ]]);

    expect(test.filterUsableSelectors([
      '#abc .page-container ::scrollbar',
    ], options)).to.be.deep.equal([true, []]);

    expect(test.filterUsableSelectors([
      '.page-container #abc view',
    ], options)).to.be.deep.equal([true, []]);

    expect(test.filterUsableSelectors([
      '.page-container #abc',
      '.page-container #abc .cc',
      '#abc .page-container',
      '#abc view .page-container',
      '#abc .page-container ::scrollbar',
      '#abc .page-container view',
    ], options)).to.be.deep.equal([true, [
      '.page-container .aabbss',
      '.page-container .aabbss .cc',
      '.aabbss .page-container',
      '.aabbss view .page-container',
    ]]);
    done();
  })
});
