import './app.css';
import img from './app.png';

const title = document.createElement('button');
title.textContent = 'title';
title.classList = ['title'];
title.style.backgroundImage = `url(${img})`;
document.body.appendChild(title);

const load_ = () => {
  return import(
    /* webpackChunkName: "underscore" */
    'underscore'
  );
};

title.onclick = (e) => {
  const arr = [1,2,3];
  load_().then((_) => {
    console.log(_.filter(arr, item => item > 1));
  });
};

export function aa () {
  console.log('aa');
};

export function bb () {
  console.log('bb');
};