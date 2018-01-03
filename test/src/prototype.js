const chai = require('chai');
const colors = require('colors');
const expect = chai.expect;
const Promise = require('../../src/prototype/promise.js');
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
          }, 300);
      });

      let p8 = p7.then(function(res) {
        expect(p7[KEY.VALUE]).to.be.equal('aa');
        expect(p7[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
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
        }, 400);
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
        }, 500);
      });

      let p12 = p11.then(function(res) {
        return 'bb';
      },function(res) {
        expect(p11[KEY.VALUE]).to.be.equal('aa');
        expect(p11[KEY.STATUS]).to.be.equal(CODE.REJECTED);
        setTimeout(() => {
          expect(p12[KEY.VALUE]).to.be.equal('cc');
          expect(p12[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
        });
        return 'cc';
      });
      let p13 = p12.then(function(res) {
        setTimeout(() => {
          expect(p13[KEY.VALUE]).to.be.equal('dd');
          expect(p13[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
        });
        return 'dd';
      });
      
      // Test3
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('success');
        }, 600);
      });

      const start = Date.now();
      promise.then((res) => {
        expect(res).to.be.equal('success');
      });

      promise.then((res) => {
        expect(res).to.be.equal('success');
        done();
      });
    });

    it('promise.catch', (done) => {
      // Test1
      let p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('aa');
        }, 300);
      });

      let p2 = p1.catch(function(res) {
        return 'aaaaaa';
      });

      let p3 = p2.then(function(res) {
        setTimeout(() => {
          expect(p1[KEY.VALUE]).to.be.equal('aa');
          expect(p1[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          expect(p2[KEY.VALUE]).to.be.equal('aa');
          expect(p2[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          expect(p3[KEY.VALUE]).to.be.equal('aa');
          expect(p3[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
        });
        return res;
      });

      // Test2
      let p4 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('aa');
        }, 300);
      });

      let p5 = p4.catch(function(res) {
        return 'aaaaaa';
      });

      let p6 = p5.then(function(res) {
        setTimeout(() => {
          expect(p4[KEY.VALUE]).to.be.equal('aa');
          expect(p4[KEY.STATUS]).to.be.equal(CODE.REJECTED);
          expect(p5[KEY.VALUE]).to.be.equal('aaaaaa');
          expect(p5[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          expect(p6[KEY.VALUE]).to.be.equal('aaaaaa');
          expect(p6[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          done();
        });
        return res;
      });
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

      // 如果是另一个r异步promise
      let p6 = Promise.resolve(new Promise((resolve, reject) => {
          setTimeout(() => {
              reject('aa');
              setTimeout(() => {
                expect(p6[KEY.VALUE]).to.be.equal('aa');
                expect(p6[KEY.STATUS]).to.be.equal(CODE.REJECTED);
              });
          }, 300);
        })
      );

      let p7 = Promise.resolve(new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve('aa');
              setTimeout(() => {
                expect(p7[KEY.VALUE]).to.be.equal('aa');
                expect(p7[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
                done();
              });
          }, 500);
        })
      );

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

      Promise.resolve(1)
        .then(2)
        .then(Promise.resolve(3))
        .then(console.log); // log 1 is right
    });

    it('Promise.reject', (done) => {
      // Test1
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

      // Test2
      let p5 = new Promise(function(resolve, reject) {
        resolve('aaa');
      });
      let p6 = Promise.reject(p5);
      expect(p5[KEY.VALUE]).to.be.equal('aaa');
      expect(p5[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
      expect(p6[KEY.VALUE]).to.be.equal(p5);
      expect(p6[KEY.STATUS]).to.be.equal(CODE.REJECTED);

      // Test3
      let p7 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('aa');
          setTimeout(() => {
            expect(p7[KEY.VALUE]).to.be.equal('aa');
            expect(p7[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
            expect(p8[KEY.VALUE]).to.be.equal(p7);
            expect(p8[KEY.STATUS]).to.be.equal(CODE.REJECTED);
            done();
          });
        }, 500);
      });
      let p8 = Promise.reject(p7);
      expect(p7[KEY.VALUE]).to.be.equal(undefined);
      expect(p7[KEY.STATUS]).to.be.equal(CODE.PENDING);
      expect(p8[KEY.VALUE]).to.be.equal(p7);
      expect(p8[KEY.STATUS]).to.be.equal(CODE.REJECTED);
    });

    it('Promise.all', (done) => {
      // Test1
      let p1 = Promise.resolve(3);
      let p2 = 1337;
      let p3 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("foo2");
          expect(p4[KEY.VALUE]).to.be.equal("foo");
          expect(p5[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          done();
        }, 500);
      }); 
      let p4 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("foo");
          expect(p5[KEY.STATUS]).to.be.equal(CODE.PENDING);
        }, 100);
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

    });

    it('Promise.race', (done) => {
      // Test1
      let p1 = new Promise(function(resolve, reject) { 
          setTimeout(resolve, 150, "one"); 
      });
      let p2 = new Promise(function(resolve, reject) { 
          setTimeout(resolve, 100, "two"); 
      });

      let p3 = Promise.race([p1, p2]);
      let p4 = p3.then(function(value) {
        setTimeout(() => {
          expect(p1[KEY.VALUE]).to.be.equal("one");
          expect(p1[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          expect(p2[KEY.VALUE]).to.be.equal("two");
          expect(p2[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          expect(p3[KEY.VALUE]).to.be.equal("two");
          expect(p3[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          expect(p4[KEY.VALUE]).to.be.equal(undefined);
          expect(p4[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
        }, 210);
      });

      // Test2
      let p5 = new Promise(function(resolve, reject) { 
          setTimeout(resolve, 150, "one"); 
      });
      let p6 = new Promise(function(resolve, reject) { 
          setTimeout(reject, 100, "two"); 
      });

      let p7 = Promise.race([p1, p2]);
      let p8 = p7.then(function(value) {
        setTimeout(() => {
          expect(p5[KEY.VALUE]).to.be.equal("one");
          expect(p5[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          expect(p6[KEY.VALUE]).to.be.equal("two");
          expect(p6[KEY.STATUS]).to.be.equal(CODE.REJECTED);
          expect(p7[KEY.VALUE]).to.be.equal("two");
          expect(p7[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          expect(p8[KEY.VALUE]).to.be.equal(undefined);
          expect(p8[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
        }, 210);
      });

      // Test3
      const test3 = () => {
        var p3 = new Promise(function(resolve, reject) { 
            setTimeout(resolve, 100, "three");
        });
        var p4 = new Promise(function(resolve, reject) { 
            setTimeout(reject, 300, "four");
            setTimeout(() => {
              expect(p3[KEY.VALUE]).to.be.equal("three");
              expect(p3[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
              expect(p4[KEY.VALUE]).to.be.equal("four");
              expect(p4[KEY.STATUS]).to.be.equal(CODE.REJECTED);
              expect(p5[KEY.VALUE]).to.be.equal("three");
              expect(p5[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
              expect(p6[KEY.VALUE]).to.be.equal(undefined);
              expect(p6[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
             done();
            }, 500);
        });

        var p5 = Promise.race([p3, p4]);
        var p6 = p5.then(function(value) {
          // p3 更快，所以它完成了              
        }, function(reason) {
          // 未被调用
        });
      };
      test3();
    });

    it('Promise.try', (done) => {
      // Test1
      const test1 = () => {
        let error = new Error('aa');
        let p1 = Promise.try(function() {
          throw error;
        });

        let p2 = p1.then(function(res) {
          setTimeout(() => {
            expect(p1[KEY.VALUE]).to.be.equal(error);
            expect(p1[KEY.STATUS]).to.be.equal(CODE.REJECTED);
            expect(p2[KEY.VALUE]).to.be.equal(undefined);
            done();
          });
        });      
      };
      test1();

      // Test2
      const test2 = () => {
        let p1 = Promise.try(function() {
          return Promise.resolve(100);
        });

        let p2 = p1.then(function(res) {
          setTimeout(() => {
            expect(p1[KEY.VALUE]).to.be.equal(100);
            expect(p1[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
            expect(p2[KEY.VALUE]).to.be.equal(undefined);
            expect(p2[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          });
        });      
      };
      test2();

      // Test3
      const test3 = () => {
        let p1 = Promise.try(function() {
          return new Promise(function(resolve) {
            setTimeout(resolve, 1000, 'aa');
          });
        });

        let p2 = p1.then(function(res) {
          setTimeout(() => {
            expect(p1[KEY.VALUE]).to.be.equal('aa');
            expect(p1[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
            expect(p2[KEY.VALUE]).to.be.equal('aa');
            expect(p2[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
            done();
          });
          return res;
        });
      };
      test3();


    });

    it('Promise.done', (done) => {
      let p1 = new Promise(function(resolve) {
        setTimeout(resolve, 1000, 'aa');
      });
      p1.done(function(res) {
        setTimeout(() => {
          expect(p1[KEY.VALUE]).to.be.equal('aa');
          expect(p1[KEY.STATUS]).to.be.equal(CODE.RESOLVED);
          done();
        });
      });
    });

    it('Promise.finally', (done) => {
      done();
    });
});