class Axios {
  constructor() {
    this.requestMiddleWares = [];
    this.responseMiddleWares = [];
    this.middlewares = {
      request(arr = []) {
        this.requestMiddleWares.push(...arr);
      },
      response(arr = []) {
        this.responseMiddleWares.push(...arr);
      },
    };
  }

  request(config) {
    const {
      method,
      url,
      data,
    } = config;

    let requestHeader = {
      method: method.toLowerCase(),
      url,
      data: JSON.stringify(data) || null,
    };

    if (Array.isArray(this.requestMiddleWares)) {
      requestHeader = this.requestMiddleWares.reduce((acc, fn) => {
        return fn(acc) || acc;
      }, requestHeader);
    }

    return fetch(url, requestHeader)
      .then((res) => res.json())
      .then((res) => {
        if (!res.ok) throw new Error('xxx');
        if (Array.isArray(this.responseMiddleWares)) {
          return this.responseMiddleWares.reduce((acc, fn) => {
            return fn(acc) || acc;
          }, res);
        }
        return res;
      });
  }

  get(config) {
    this.request({
      method: 'get',
      ...config,
    });
  }

  post(config) {
    this.request({
      method: 'post',
      ...config,
    });
  }
}

// test
const axios = new Axios();

axios.middlewares.request([() => console.log("request1"), () => console.log("request2")]);
axios.middlewares.response([() => console.log("response1"), () => console.log("response2")]);

axios.post({
  url: 'url',
  data: { a: 1 },
});
axios.get({
  url: 'url',
});