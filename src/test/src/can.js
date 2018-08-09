
import { Component } from 'can';

const HelloWorld = Component.extend({
  tag: 'hello-world',
  view: `<h1>{{greeting}} world!</h1>`,
  ViewModel: { greeting: 'string' },
});

var helloWorld = new HelloWorld();

