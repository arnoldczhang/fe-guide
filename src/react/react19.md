# react19

## hook

### memo
> 缓存组件，避免不必要重渲染

```jsx
const ListItem = memo(({ item, isSelected, onClick }) => {
  console.log(`渲染列表项 ${item.id}`); // 用于演示重渲染情况
  return (
    <li 
      onClick={() => onClick(item.id)}
      style={{
        padding: '10px',
        margin: '5px 0',
        background: isSelected ? '#e3f2fd' : '#f5f5f5',
        cursor: 'pointer',
        borderRadius: '4px'
      }}
    >
      {item.title}
    </li>
  );
});
```

### useCallback
> 缓存函数定义

```jsx
const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const result = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!result.ok) return;
    setList((await result.json()).map((item: Item) => ({
      id: item.id,
      title: item.title,
    })));
  } finally {
    setLoading(false);
  }
}, []);
```

### useState

> 创建当次快照和更新下次快照的数据的方法

**更新普通数据类型**

```jsx
// count是当次快照的数据
// setCount是更新下次快照的数据的方法
const [count, setCount] = useState(0);

// 回调式更新
setCount(prev => prev + 1);
```

**更新对象**

```jsx
const [person, setPerson] = useState({
    name: 'abc',
    detail: {
        age: 18,
    },   
});

// 以展开对象的形式更新
setPerson(prev => ({
    ...prev,
    detail: {
        ...prev.detail,
        age: prev.detail.age + 100,
    },
}));

// 以（推荐）mutation式更新
import { useImmer } from 'use-immer';

const [person, setPerson] = useImmer({
    name: 'abc',
    detail: {
        age: 18,
    },   
});

setPerson(draft=> {
    draft.detail.age += 100;
});
```

**更新数组**

```jsx
const [shapes, setShapes] = useState([]);

// 新增
setShapes(prev => [
  ...prev,
  { id: 1, x: 0, y: 0 },
]);

setShapes(prev => [
  { id: 1, x: 0, y: 0 },
  ...prev,
]);

// 删除
setShapes(prev => prev.filter((item) => item.id === 1));

// 批量更新
setShapes(prev => prev.map((item) => {
  if (item.id === 1) {
    return {
      ...item,
      id: item.id + 1,
    };
  }
  return item;
}));

// 插入
const insertIndex = 1;
setShape(prev => [
  ...prev.slice(0, insertIndex),
  { id: 1, x: 0, y: 0 },
  ...prev.slice(insertIndex),
]);

// 翻转、排序
setShape(prev => {
  const newPrev = [...prev];
  newPrev.traverse();
  return newPrev;
});

// 以（推荐）mutation式更新
import { useImmer } from 'use-immer';

const [shapes, setShapes] = useImmer([]);

setShapes(draft => {
  draft.push({
    id: nextId++,
  });
});
setShapes(draft => {
  const todo = draft.find(t =>
    t.id === nextTodo.id
  );
  todo.title = nextTodo.title;
  todo.done = nextTodo.done;
});
setShapes(draft => {
  const index = draft.findIndex(t =>
    t.id === todoId
  );
  draft.splice(index, 1);
});
```

### useMemo

> computed
> 
> 黄金法则：
> 
> 1. 简单计算别用
> 
> 2. 计算成本 > 1ms的操作，可用
> 
> 3. 作为其他hook的依赖项，可用

```jsx
const memorizedValue = useMemo(() => {
    return getComputedValue(a, b);
}, [a, b]); // 依赖a、b


const staticMemorizedValue = useMemo(() => ({
    easing: 'ease-in',
}), []); // 空依赖 = 永久缓存同一引用
```

**执行顺序**

```textile
初始渲染：
[计算函数执行] → [缓存结果]

重渲染时：
[依赖项变化] → [重新计算] → [更新缓存]
[依赖项未变] → [直接返回缓存值]
```

### useEffect

> 副作用处理（watch、mounted、beforeUnMount）
> 
> 黄金法则：
> 
> 1. 一个effect只做一件事
> 
> 2. 依赖项必须正确
> 
> 3. 清理函数要和effect对应

```jsx
/**
* 触发条件
* 1. （无deps时）mounted触发
* 2. （有deps时）依赖更新时触发
**/
useEffect(() => {
    // ...一些逻辑
    return () => { /* beforeUnMount时触发 */ }
}, [deps]);
```

**执行顺序**

```text
Mount阶段：
[组件挂载] → [执行effect回调]

Update阶段：
[依赖项变化] → [执行清理函数] → [执行新effect]

Unmount阶段：
[组件卸载] → [执行清理函数]
```

### useContext

> Provider/Inject

```jsx
const ThemeContext = createContext('example');

// 注入
<ThemeContext.Provider value={'dark'}>
    <child />
</ThemeContext.Provider>


// 消费
const theme = useContext(ThemeContext);
```

### useRef
> 适用于组件生命周期内持久化存储值
>
> 区别于useState，改动不会触发渲染
>
> 常用于：定时器、DOM操作

```jsx
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('你点击了 ' + ref.current + ' 次！');
  }

  return (
    <div>
      <button onClick={handleClick}>
        点击我！
      </button>
    </div>
  );
}

```