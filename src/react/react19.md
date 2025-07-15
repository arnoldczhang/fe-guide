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
> 不能对比beforeValue和value，挺尴尬
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
* 1. （无第二个参数时）每次渲染后执行
* 2. （无deps时）mounted触发
* 3. （有deps时）mounted或某个依赖更新时触发
**/
useEffect(() => {
    // ...一些逻辑
    return () => { /* beforeUnMount时触发 */ }
}, [deps]);
```

**关于react18+执行两次mounted**

- 不建议关闭
- 不建议用类似`mountedRef`来阻止，没解决问题
- 添加useEffect对应的销毁函数是正解

```jsx
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    
    // 保证组件销毁时，不重新渲染
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
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

### useImperativeHandle
> 限制useRef暴露的功能

```jsx
import { useRef, useImperativeHandle } from 'react';

// 方式一：正常透传ref
function MyInput({ ref }) {
  return (
    <>
      <input type="text" ref={ref} />
    </>
  )
}

// 方式二：仅透传focus
function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, {
    focus() {
      realInputRef.current.focus();
    },
  })

  return (
    <>
      <input type="text" ref={realInputRef} />
    </>
  )
}

function Form() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    console.log(inputRef.current); // 仅focus
    inputRef.current.focus(); 
  };

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleFocus}>click</button>
    </>
  )
}
```

### useEffectEvent
> 从effect中提取你不希望是响应式的逻辑，但是又能实时监听最新prop和state
>
> 黄金法则：
>
> 1. 永远在调用的effect旁边注册useEffectEvent，因为他们是effect的片段

```jsx
function ChatRoom({ roomId, theme }) {
  // 会实时读取最新theme，但是theme的变化，不影响connect
  const onConnected = useEffectEvent((msg) => {
    showNotification('Connected!', theme);
  });

  // 只有roomId的变化才会影响connect
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected('hello');
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

## 时机

### flushSync
> 执行完传入的方法后，立即更新dom
>
> 适用于：动态添加dom后立即交互的场景

```jsx
function List() {
  flushSync(() => {
    setText('');
    setTodos([ ...todos, newTodo]);
  });
  listRef.current.lastChild.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });

  return (
    <ul ref={listRef}>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}
```

