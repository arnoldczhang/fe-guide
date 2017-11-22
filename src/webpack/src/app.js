import img from './app.png';
import { aa } from './app2.js';
import { abs } from './test2.js';

const title = document.createElement('h1');
title.textContent = 'title';
title.classList = ['title'];
title.style.backgroundImage = `url(${img})`;
// if (process.env.NODE_ENV !== 'production') {
//   aa();
// }
console.log(abs());

// title.onclick = aa;
document.body.appendChild(title);