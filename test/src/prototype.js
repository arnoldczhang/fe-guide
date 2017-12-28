const chai = require('chai');
const colors = require('colors');
const expect = chai.expect;
const Promise = require('../../src/prototype');
const CODE = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};
const KEY = {
  VALUE: '[[PromiseValue]]',
  STATUS: '[[PromiseStatus]]',
};

describe('Promise', () => {
    it('Promise.resolve', (done) => {
      let p1 = Promise.resolve(1);
      // 如果是基本类型
      p1.then((res) => {
        expect(res).to.be.equal(1);
      });
      // 如果是数组
      let p2 = Promise.resolve([1,2,3]);
      p2.then((res) => {
        expect(res).to.be.deep.equal([1,2,3]);
      });
      // 如果是另一个promise
      let p3 = Promise.resolve(Promise.resolve([1,2,3]));
      p3.then((res) => {
        expect(res).to.be.deep.equal([1,2,3]);
      });

      // 如果是thenable
      let err = new TypeError("Throwing");
      let thenable = { then: function(resolve) {
        throw err;
        resolve("Resolving");
      }};

      let p4 = Promise.resolve(thenable);
      p4.then(function(v) {
        console.log('1111');
      }, function(e) {
        expect(e).to.be.deep.equal(err);
      });
      done();
    });

    it('Promise.reject', (done) => {
      let p1 = Promise.reject("Testing static reject");
      let p2 = p1.then((reason) => {
        // 未被调用
      }, (reason) => {
        expect(reason).to.be.equal("Testing static reject");
      });
      expect(p1[KEY.VALUE]).to.be.equal("Testing static reject");
      expect(p2[KEY.VALUE]).to.be.equal(undefined);
      expect(p2[KEY.STATUS]).to.be.equal(CODE.RESOLVED);

      let err = new Error("fail");
      let p3 = Promise.reject(err);
      let p4 = p3.then(function(error) {
        // 未被调用
      }, function(error) {
        expect(error).to.be.deep.equal(err);
      });
      expect(p3[KEY.VALUE]).to.be.equal(err);
      expect(p3[KEY.STATUS]).to.be.equal(CODE.REJECTED);
      done();
    });
});