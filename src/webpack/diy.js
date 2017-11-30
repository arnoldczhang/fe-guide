const Person = require('./src/person.pojo');
const person = Person();
person.setFavorites([]);
person.getFavorites();
const title = document.createElement('h1');
title.textContent = 'title';
title.classList = ['title'];
document.body.appendChild(title);
