import img from './app.png';
import './app2.js';

const title = document.createElement('h1');
title.textContent = 'title';
title.classList = ['title'];
title.style.backgroundImage = `url(${img})`;

document.body.appendChild(title);