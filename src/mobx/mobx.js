import {
  observable,
  intercept,
  extendObservable,
} from "mobx"

function Todo() {
    this.id = Math.random();
    extendObservable(this, {
        title: "",
        finished: false,
        arr: [],
        attrs: {
          aa: 1,
        },
    });
};

window.todo = new Todo;
intercept(todo, 'title', function(change) {
  console.log(212122, change);
});


// class Todo {
//     id = Math.random();
//     @observable title = "";
//     @observable finished = false;
//     @observable list = [];
// }