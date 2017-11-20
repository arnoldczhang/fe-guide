import './app.css';
import img from './app.png';

const title = document.createElement('p');
title.textContent = 'title';
title.classList = ['title'];
title.style.backgroundImage = `url(${img})`;
document.body.appendChild(title);
