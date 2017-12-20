import styles from './flyball.less';

class Ball{
  constructor(el, bg, size) {
    this.el = el;
    this.bg = bg;
    this.size = size;
    this.initialize();
  }

  initialize() {
    this.resolveData()
      .getTemplate()
      .bindEvent()
      .render();
  }

  resolveData() {
    this.rect = this.el.getBoundingClientRect();
    this.event = 'transitionend';
    this.transitionEnd = (e) => {
      // document.body.removeChild(this.ball);
      this.ball.removeEventListener(this.event, this.transitionEnd);
    };
    return this;
  }

  getTemplate() {
    const container = document.createElement('div');
    const template = `
      <section class='${styles.locals.flyball}'>
        <svg class='${styles.locals.inner}' style='background-color: ${this.bg};' version='1.1' xmlns='http://www.w3.org/2000/svg' />
      </section>
    `;
    container.innerHTML = template;
    this.box = container.children[0];
    this.box.style.left = `${this.rect.left - this.size}px`;
    this.box.style.top = `${this.rect.top - this.size}px`;
    this.ball = this.box.children[0];
    return this;
  }

  bindEvent() {
    this.box.style.transform = 'translate3d(' + this.rect.left + 'px, 0, 0)';
    this.ball.style.transform = 'translate3d(0, ' + this.rect.top + 'px, 0)';
    this.ball.addEventListener(this.event, this.transitionEnd, false);
    return this;
  }

  render() {
    document.body.appendChild(this.box);
    return this;
  }
}

const Fly  = (input, bg = '#f8c74e', size = 36) => {
  let el;
  if (input instanceof Element) {
    el = input;
  } else if (typeof input === 'object') {
    el = input.target || input.currentTarget;
  } else {
    throw new Error('formatted error');
  }
  return new Ball(el, bg, size);
};

window.Fly = Fly;

export default Fly;