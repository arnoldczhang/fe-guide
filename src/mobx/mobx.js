import {
  observable,
  extendObservable,
} from "mobx"

function Todo() {
    this.id = Math.random();
    extendObservable(this, {
        title: "",
        finished: false,
        arr: [],
    });
};

window.todo = new Todo();
console.log(todo);


// class Todo {
//     id = Math.random();
//     @observable title = "";
//     @observable finished = false;
//     @observable list = [];
// }