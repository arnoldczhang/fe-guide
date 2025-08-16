/* eslint-disable */
import { parseResponse } from '../../src/utils/mock';

console.log('mock脚本植入');

let interceptor = [];
window.addEventListener('message', (e) => {
  const { type, data } = e.data?.data || {};
  switch (type) {
    case 'init-data':
      interceptor = data.filter(({ status }) => status);
      break;
  }
});

const replaceResponseText = (xhr) => {
  const { responseURL, responseText } = xhr;
  const matched = interceptor.find(({ name }) => responseURL.indexOf(name) > -1) as any;
  if (!matched) return responseText;
  const matchedTag = matched.tags.find(({ status }) => status);
  if (!matchedTag) return responseText;
  try {
    const result = parseResponse(matchedTag.data);
    console.log(`拦截了：${responseURL}`, result);
    return JSON.stringify(result);
  } catch(err) {
    return responseText;
  }
};

const oldXMLHttpRequest = window.XMLHttpRequest;

(window as any).XMLHttpRequest = function XMLHttpRequest () {
  const actual = new oldXMLHttpRequest();
  const self = this;
  self.onreadystatechange = null;

  function onLoadStart() {}

  function onLoadEnd() {}

  function onError() {}

  // this is the actual handler on the real XMLHttpRequest object
  actual.onreadystatechange = function onreadystatechange () {
    if (this.readyState == oldXMLHttpRequest.OPENED) {
      onLoadStart.call(this);
    } else if (this.readyState == oldXMLHttpRequest.DONE) {
      if (this.status === 200) {
        onLoadEnd.call(this);
      } else {
        onError.call(this);
      }
    }
    if (self.onreadystatechange) {
      return self.onreadystatechange();
    }
  };

  Object.defineProperty(self, 'responseText', {
    get() {
      return replaceResponseText(actual);
    },
  });

  // add all proxy getters
  ["status", "statusText", "responseType", "response",
  "readyState", "responseXML", "upload"
  ].forEach(function (key) {
    Object.defineProperty(self, key, {
      get() {
        return actual[key];
      },
      set(val) {
        actual[key] = val;
      }
    });
  });

  // add all proxy getters/setters
  ["ontimeout, timeout", "withCredentials", "onload", "onerror",
  "onprogress","onabort","onloadend","onloadstart"].forEach(function (key) {
    Object.defineProperty(self, key, {
      get() {
        return actual[key];
      },
      set(val) {
        actual[key] = val;
      }
    });
  });

  // add all pure proxy pass-through methods
  ["addEventListener", "send", "open", "abort", "getAllResponseHeaders",
  "getResponseHeader", "overrideMimeType", "setRequestHeader",
  "removeEventListener"].forEach(function (key) {
    Object.defineProperty(self, key, {
      writable: true,
      value() {
        return actual[key].apply(actual, arguments);
      }
    });
  });
};