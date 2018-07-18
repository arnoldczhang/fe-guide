
// https://www.sitepen.com/blog/2018/07/06/web-components-in-2018/
class CounterElement extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const dom = {
      shadowRoot,
      countValue: 0,
    };
    this.initStyle(dom)
      .initHtml(dom)
      .initElement()
      .bindEvent(dom);
  }

  initStyle(dom) {
    dom.style = `
      :host {
          position: relative;
          font-family: sans-serif;
      }

      #counter-increment, #counter-decrement {
          width: 60px;
          height: 30px;
          margin: 20px;
          background: none;
          border: 1px solid black;
      }

      #counter-value {
          font-weight: bold;
      }
    `;
    return this;
  }

  initHtml(dom) {
    dom.shadowRoot.innerHTML = `
        <style>${dom.style}</style>
        <h3>Counter</h3>
        <slot name='counter-content'>Button</slot>
        <button id='counter-increment'> - </button>
        <span id='counter-value'>; ${dom.countValue || 0} </span>;
        <button id='counter-decrement'> + </button>
    `;
    return this;
  }

  increment(dom) {
    dom.countValue += 1;
    this.render(dom);
  }

  decrement(dom) {
    dom.countValue -= 1;
    this.render(dom);
  }

  initElement() {
    this.incrementButton = this.shadowRoot.querySelector('#counter-increment');
    this.decrementButton = this.shadowRoot.querySelector('#counter-decrement');
    this.counterValue = this.shadowRoot.querySelector('#counter-value');
    return this;
  }

  bindEvent(dom) {
    this.incrementButton.addEventListener('click', this.decrement.bind(this, dom));
    this.decrementButton.addEventListener('click', this.increment.bind(this, dom));
  }

  render(dom) {
    this.counterValue.innerHTML = dom.countValue;
  }
}
customElements.define('counter-element', CounterElement);
