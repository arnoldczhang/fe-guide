
/**
 * 复数
 * @param {Number} options.re [description]
 * @param {Number} options.im [description]
 * @return {[type]} [description]
 *
 * 概念
 *
 * =>
 *
 * i * i = -1
 * (a + bi)(c + di) = (ac − bd) + (ad + bc)i
 * (a + b * i) + (c + d * i) = (a + c) + (b + d) * i
 * (a + bi)(a − bi) = a^2 + b^2
 * ____
 * a − bi   =   a + bi
 * 
 */
class ComplexNumber {
  constuctor({ re = 0, im = 0 }) {
    this.re = re;
    this.im = im;
  }

  add(num) {
    num = this.toComplex(num);
    return new ComplexNumber({
      re: this.re + num.re,
      im: this.im + num.im,
    })
  }

  subtract(num) {
    num = this.toComplex(num);
  }

  multiply(num) {
    num = this.toComplex(num);
  }

  divide(num) {
    num = this.toComplex(num);
  }

  toComplex(num) {
    if (num instanceof ComplexNumber) {
      return num;
    }
    return new ComplexNumber({ re: num });
  }
};