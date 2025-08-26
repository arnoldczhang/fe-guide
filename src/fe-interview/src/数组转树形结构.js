/**
 * 数组转树形结构
 * 
 * 1. 考虑数据乱序场景
 * 2. 复杂度（一次遍历）
 * 
 * @param {*} arr 
 * @returns 
 */

// 方式一：reduce
const toTree = (arr = []) => {
  const cach = new Map();
  return arr.reduce((res, pre) => {
    const newItem = {
      ...pre,
      children: [],
    };
    const { parentId } = pre;
    if (!parentId) {
      if (cach.has(pre.id)) {
        newItem.children = cach.get(pre.id).children;
      }
      cach.set(pre.id, newItem);
      res.push(newItem);
      return res;
    }

    if (cach.has(parentId)) {
      cach.get(parentId).children.push(newItem);
      cach.set(pre.id, newItem);
    } else {
      cach.set(parentId, {
        id: parentId,
        children: [newItem],
      });
    }
    return res;
  }, []);
}

// 方式二：未知父节点，借助临时数组
const toTree2 = (arr = []) => {
  const result = [];
  const cach = new Map();
  const pendingCach = new Map();

  arr.forEach((item) => {
    const { parentId, id } = item;
    const newNode = {
      ...item,
      children: [],
    };
    cach.set(id, newNode);

    if (pendingCach.has(id)) {
      newNode.children = pendingCach.get(id);
      pendingCach.set(id, []);
    }

    if (!parentId) {
      result.push(newNode);
    } else if (cach.has(parentId)) {
      cach.get(parentId).children.push(newNode)
    } else {
      pendingCach.set(parentId, [...(pendingCach.get(parentId) || []), newNode]);
    }
  });
  return result;
};

// test
const items = [  
  { id: 1, name: 'Item 1', parentId: null },
  { id: 2, name: 'Item 1.1', parentId: 1 },
  { id: 3, name: 'Item 1.2', parentId: 1 },
  { id: 4, name: 'Item 2', parentId: null },
  { id: 5, name: 'Item 2.1', parentId: 4 },
];
const items2 = [  
  { id: 1, name: 'Item 1', parentId: null },
  { id: 5, name: 'Item 2.1', parentId: 4 },
  { id: 2, name: 'Item 1.1', parentId: 1 },
  { id: 3, name: 'Item 1.2', parentId: 1 },
  { id: 4, name: 'Item 2', parentId: null },
];
console.log(JSON.stringify(toTree(items), null, 2) === JSON.stringify(toTree(items2), null, 2));