const { parse } = require("acorn");
debugger;

const codeStr = `
  for(var i = 0; i < 100; i++){
      if(i % 2 == 0){
          console.log("foo");
      }else{
          console.log("bar");
      }
  }
`;

const ast = parse(codeStr);
console.log(ast);