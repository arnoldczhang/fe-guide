/**
 * URLSearchParams
 */
class URLSearchParams {
  constructor(search) {
    this.search = search;
    this.init();
  }

  init() {
    const type = typeof this.search;
    if (type === 'string') {
      this.searchObj = this.convert2Obj();
    } else if (type === 'object') {
      this.searchObj = this.search;
      this.search = this.convert2Str();
    } else {
      throw new Error('search must be string or object');
    }
  }

  get(key) {
    return this.searchObj[key];
  }
  
  set(key, value) {
    this.searchObj[key] = value;
    this.search = this.convert2Str();
  }
  
  has(key) {
    return key in this.searchObj;
  }
  
  append(key, value) {
    if (key in this.searchObj) {
      const val = this.searchObj[key];
      if (Array.isArray(val)) {
        val.push(value);
        this.searchObj[key] = val;
      } else {
        this.searchObj[key] = [val, value];
      }
      this.search = this.convert2Str();
    }
  }
  

  convert2Obj(search = this.search) {
    const arr = search.split('&');
    const result = {};
    arr.forEach((v) => {
      const [ key, value ] = v.split('=');
      if (key) {
        if (key in result) {
          result[key] = Array.isArray(result[key]) ? result[key].concat(value) : [result[key], value];
        } else {
          result[key] = value;
        }
      }
    });
    return result;
  }

  convert2Str(obj = this.searchObj) {
    return Object.keys(obj).reduce((key, res) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        res += value.map(val => `&${key}=${val}`).join('');
      } else {
        res += `&${key}=${value}`;
      }
      return res;
    }, '');
  }

  [Symbol.iterator]() {
    const arr = Object.entries(this.searchObj);
    let index = 0;
		return {
			next: () => {
				return {
					value: arr[index],
					done: index++ >= arr.length,
				};
			},
		};
	}
}

searchParams = new URLSearchParams("foo=1&bar=2") 

// 构造函数也支持传入一个包含参数键值对的对象
searchParams = new URLSearchParams({foo: "1", bar: "2"})

// 实例支持 get()、set()、has()、append() 四个方法
console.log(searchParams.get("foo")) // "1"
searchParams.set("foo", "10") 
console.log(searchParams.has("bar")) // true
searchParams.append("foo", "100") 

// 实例支持 toString() 方法
console.log(searchParams.toString()) // "foo=10&bar=2&foo=100"

// 实例支持 for-of 迭代
for(const [key, value] of searchParams) {
  console.log([key, value])
  // ["foo", "10"]
  // ["bar", "2"]
  // ["foo", "100"]
}