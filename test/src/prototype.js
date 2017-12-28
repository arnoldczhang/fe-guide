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
    it('promise.then', (done) => {
      // Test1
      let p1 = new Promise(function(resolve,reject) {
        resolve("Testing static reject");
      });
      let p2 = p1.then((reason) => {
        // 未被调用
        return 'aabb';
      }, (reason) => {
        console.log(reason);
        return 'cccc';
      });
      expect(p1[KEY.VALUE]).to.be.equal('Testing static reject');
      expect(p1[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
      expect(p2[KEY.VALUE]).to.be.equal('aabb');
      expect(p2[KEY.STATUS]).to.be.equal(CODE.RESOLVED);

      // Test2
      let p3 = new Promise(function(resolve,reject) {
        reject("Testing static reject");
      });
      let p4 = p3.then((reason) => {
        // 未被调用
        return 'aabb';
      }, (reason) => {
        console.log(reason);
        return 'cccc';
      });
      expect(p3[KEY.VALUE]).to.be.equal('Testing static reject');
      expect(p3[KEY.STATUS]).to.be.equal(CODE.REJECTED);
      expect(p4[KEY.VALUE]).to.be.equal('cccc');
      expect(p4[KEY.STATUS]).to.be.equal(CODE.RESOLVED);

      // Test3
      let p7 = new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve('aa');
          }, 3000);
      });

      let p8 = p7.then(function(res) {
        expect(p7[KEY.VALUE]).to.be.equal('aa');
        expect(p7[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
        console.log(res);
        setTimeout(() => {
          expect(p8[KEY.VALUE]).to.be.equal('bb');
          expect(p8[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
        });
        return 'bb';
      });

      // Test4
      let p9 = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('aa');
        }, 3000);
      });

      let p10 = p9.then(function(res) {
        expect(p9[KEY.VALUE]).to.be.equal('aa');
        expect(p9[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
        setTimeout(() => {
          expect(p10[KEY.VALUE]).to.be.equal('bb');
          expect(p10[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
        });
        return 'bb';
      },function(res) {
        return 'cc';
      });

      // Test5
      let p11 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('aa');
        }, 3000);
      });

      let p12 = p11.then(function(res) {
        return 'bb';
      },function(res) {
        expect(p11[KEY.VALUE]).to.be.equal('aa');
        expect(p11[KEY.STATUS]).to.be.equal(CODE.REJECTED);
        setTimeout(() => {
          expect(p10[KEY.VALUE]).to.be.equal('cc');
          expect(p10[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
        });
        return 'cc';
      });
      done();
    });

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

    it('Promise.all', (done) => {
      let p1 = Promise.resolve(3);
      let p2 = 1337;
      let p3 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("foo2");
          expect(p4[KEY.VALUE]).to.be.equal("foo");
          expect(p5[KEY.STATUS]).to.be.equal(CODE.PENDING);
        }, 4000);
      }); 
      let p4 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("foo");
          expect(p5[KEY.STATUS]).to.be.equal(CODE.PENDING);
        }, 3000);
      }); 
      let p5 = Promise.all([p1, p2, p3, p4]);
      let p6 = p5.then(values => { 
        expect(p1[KEY.VALUE]).to.be.equal(3);
        expect(p3[KEY.VALUE]).to.be.equal("foo2");
        expect(p4[KEY.VALUE]).to.be.equal("foo");
        expect(values).to.be.deep.equal([3, 1337, "foo2", "foo"]);
        expect(p5[KEY.VALUE]).to.be.deep.equal([3, 1337, "foo2", "foo"]);
        expect(p5[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
        setTimeout(() => {
          expect(p6[KEY.VALUE]).to.be.deep.equal(undefined);
        });
      });

      done();
    });
});