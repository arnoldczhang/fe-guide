export const isPlainObject = function isPlainObject() {
  console.log(1);
  function aa() {
    console.log(3);
  }
};

export const isSrting = () => {
  console.log(2);

  function aa() {
    console.log(3);
  }
};

export const isAa = function isAa() {
  console.log(4);
  function aa() {
    console.log(3);
  }
};

function v1() {
  console.log(1231132);
}
function v2() {
}

export {
  v1,
  v1 as streamV1,
  v2 as streamV2,
};
