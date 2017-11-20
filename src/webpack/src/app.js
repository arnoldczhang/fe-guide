import img from './app.png';

const title = document.createElement('h1');
title.textContent = 'title';
title.classList = ['title'];
title.style.backgroundImage = `url(${img})`;
document.body.appendChild(title);