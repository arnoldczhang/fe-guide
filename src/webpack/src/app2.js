import img from './app.png';
import styles from './app.less';

const title = document.createElement('button');
title.textContent = 'title';
title.classList = [styles.title];
title.style.backgroundImage = `url(${img})`;
document.body.appendChild(title);

const load_ = () => {
  return new Promise((resolve) => {
    require.ensure([], (require) => {
      resolve(require('underscore'));
    });
  });
};

title.onclick = () => {
  const arr = [1, 2, 3];
  load_().then((_) => {
    console.log(_.filter(arr, item => item > 1));
  });
};

export function aa() {
  console.log('aa');
}

export function bb() {
  console.log('bb');
}
