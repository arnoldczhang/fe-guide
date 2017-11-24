import img from './app.png';
// import { abs } from './test2.js';
import styles from './app.less';

const title = document.createElement('h1');
title.textContent = 'title';
title.classList = [styles.title];
title.style.backgroundImage = `url(${img})`;
// if (process.env.NODE_ENV !== 'production') {
//   aa();
// }
// console.log(abs());

title.onclick = () => {
  import('./app2.js').then((res) => {
    res.aa();
  });
};
document.body.appendChild(title);
