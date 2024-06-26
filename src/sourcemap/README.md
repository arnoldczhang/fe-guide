# sourcemap原理

## 参考
- http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html
- http://javascript.ruanyifeng.com/tool/sourcemap.html
- ...

---

## 解释

### version
> Source map的版本，目前为3

### sources
> 转换前文件目录名。数组，表示多个文件合并

### names
> 转换前的所有变量名和属性名

### mappings
> 记录位置信息的字符串

**第一层** 行对应：分号";"分割，分号前的内容，分别对应一行转换后的代码

**第二层** 位置对应：逗号","分割，逗号前的内容，分别对应源码的一个位置，比如变量名

每个位置使用**五位字符**，表示五个字段：

- 第一位，表示这个位置在（转换后的代码的）的第几列；
- 第二位，表示这个位置属于sources属性中的哪一个文件；
- 第三位，表示这个位置属于转换前代码的第几行；
- 第四位，表示这个位置属于转换前代码的第几列；
- 第五位，表示这个位置属于names属性中的哪一个变量；

```
例：aAuCA，表示：
现文件26列
sources中第1个文件
原文件46行
原文件2列
names中的第一个变量
```

**第三层** 位置转换：该位置对应的转换前的源码位置，VLQ编码，参考：http://javascript.ruanyifeng.com/tool/sourcemap.html#toc4；

### file
> 转换后的文件名

### sourcesContent
> 转换前文件

### sourceRoot
> 转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空

---

## 格式
```javascript
{
    "version": 3,
    "sources": ["webpack:///webpack/bootstrap 743d69922007585e8c8d"],
    "names": ["__webpack_require__", "moduleId", "installedModules", "exports", "module", "i", "l", "modules", "call", "parentJsonpFunction", "window", "chunkIds", "moreModules", "executeModules", "chunkId", "result", "resolves", "length", "installedChunks", "push", "Object", "prototype", "hasOwnProperty", "shift", "s", "1", "e", "onScriptComplete", "script", "onerror", "onload", "clearTimeout", "timeout", "chunk", "Error", "undefined", "installedChunkData", "Promise", "resolve", "promise", "reject", "head", "document", "getElementsByTagName", "createElement", "type", "charset", "async", "nc", "setAttribute", "src", "p", "setTimeout", "appendChild", "m", "c", "d", "name", "getter", "o", "defineProperty", "configurable", "enumerable", "get", "n", "__esModule", "object", "property", "oe", "err", "console", "error"],
    "mappings": "aAuCA,SAAAA,EAAAC,GAGA,GAAAC,EAAAD,GACA,OAAAC,EAAAD,GAAAE,QAGA,IAAAC,EAAAF,EAAAD,IACAI,EAAAJ,EACAK,GAAA,EACAH,YAUA,OANAI,EAAAN,GAAAO,KAAAJ,EAAAD,QAAAC,IAAAD,QAAAH,GAGAI,EAAAE,GAAA,EAGAF,EAAAD,QA1DA,IAAAM,EAAAC,OAAA,aACAA,OAAA,sBAAAC,EAAAC,EAAAC,GAIA,IADA,IAAAZ,EAAAa,EAAAC,EAAAV,EAAA,EAAAW,KACQX,EAAAM,EAAAM,OAAoBZ,IAC5BS,EAAAH,EAAAN,GACAa,EAAAJ,IACAE,EAAAG,KAAAD,EAAAJ,GAAA,IAEAI,EAAAJ,GAAA,EAEA,IAAAb,KAAAW,EACAQ,OAAAC,UAAAC,eAAAd,KAAAI,EAAAX,KACAM,EAAAN,GAAAW,EAAAX,IAIA,IADAQ,KAAAE,EAAAC,EAAAC,GACAG,EAAAC,QACAD,EAAAO,OAAAP,GAEA,GAAAH,EACA,IAAAR,EAAA,EAAYA,EAAAQ,EAAAI,OAA2BZ,IACvCU,EAAAf,IAAAwB,EAAAX,EAAAR,IAGA,OAAAU,GAIA,IAAAb,KAGAgB,GACAO,EAAA,GA6BAzB,EAAA0B,EAAA,SAAAZ,GA+BA,SAAAa,IAEAC,EAAAC,QAAAD,EAAAE,OAAA,KACAC,aAAAC,GACA,IAAAC,EAAAf,EAAAJ,GACA,IAAAmB,IACAA,GACAA,EAAA,OAAAC,MAAA,iBAAApB,EAAA,aAEAI,EAAAJ,QAAAqB,GAvCA,IAAAC,EAAAlB,EAAAJ,GACA,OAAAsB,EACA,WAAAC,QAAA,SAAAC,GAA0CA,MAI1C,GAAAF,EACA,OAAAA,EAAA,GAIA,IAAAG,EAAA,IAAAF,QAAA,SAAAC,EAAAE,GACAJ,EAAAlB,EAAAJ,IAAAwB,EAAAE,KAEAJ,EAAA,GAAAG,EAGA,IAAAE,EAAAC,SAAAC,qBAAA,WACAf,EAAAc,SAAAE,cAAA,UACAhB,EAAAiB,KAAA,kBACAjB,EAAAkB,QAAA,QACAlB,EAAAmB,OAAA,EACAnB,EAAAI,QAAA,KAEAhC,EAAAgD,IACApB,EAAAqB,aAAA,QAAAjD,EAAAgD,IAEApB,EAAAsB,IAAAlD,EAAAmD,EAAA,GAAArC,EAAA,2BACA,IAAAkB,EAAAoB,WAAAzB,EAAA,MAgBA,OAfAC,EAAAC,QAAAD,EAAAE,OAAAH,EAaAc,EAAAY,YAAAzB,GAEAW,GAIAvC,EAAAsD,EAAA/C,EAGAP,EAAAuD,EAAArD,EAGAF,EAAAwD,EAAA,SAAArD,EAAAsD,EAAAC,GACA1D,EAAA2D,EAAAxD,EAAAsD,IACArC,OAAAwC,eAAAzD,EAAAsD,GACAI,cAAA,EACAC,YAAA,EACAC,IAAAL,KAMA1D,EAAAgE,EAAA,SAAA5D,GACA,IAAAsD,EAAAtD,KAAA6D,WACA,WAA2B,OAAA7D,EAAA,SAC3B,WAAiC,OAAAA,GAEjC,OADAJ,EAAAwD,EAAAE,EAAA,IAAAA,GACAA,GAIA1D,EAAA2D,EAAA,SAAAO,EAAAC,GAAsD,OAAA/C,OAAAC,UAAAC,eAAAd,KAAA0D,EAAAC,IAGtDnE,EAAAmD,EAAA,GAGAnD,EAAAoE,GAAA,SAAAC,GAA8D,MAApBC,QAAAC,MAAAF,GAAoBA",
    "file": "common.743d69922007585e8c8d.js",
    "sourcesContent": [" \t// install a JSONP callback for chunk loading\n \tvar parentJsonpFunction = window[\"webpackJsonp\"];\n \twindow[\"webpackJsonp\"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {\n \t\t// add \"moreModules\" to the modules object,\n \t\t// then flag all \"chunkIds\" as loaded and fire callback\n \t\tvar moduleId, chunkId, i = 0, resolves = [], result;\n \t\tfor(;i < chunkIds.length; i++) {\n \t\t\tchunkId = chunkIds[i];\n \t\t\tif(installedChunks[chunkId]) {\n \t\t\t\tresolves.push(installedChunks[chunkId][0]);\n \t\t\t}\n \t\t\tinstalledChunks[chunkId] = 0;\n \t\t}\n \t\tfor(moduleId in moreModules) {\n \t\t\tif(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {\n \t\t\t\tmodules[moduleId] = moreModules[moduleId];\n \t\t\t}\n \t\t}\n \t\tif(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);\n \t\twhile(resolves.length) {\n \t\t\tresolves.shift()();\n \t\t}\n \t\tif(executeModules) {\n \t\t\tfor(i=0; i < executeModules.length; i++) {\n \t\t\t\tresult = __webpack_require__(__webpack_require__.s = executeModules[i]);\n \t\t\t}\n \t\t}\n \t\treturn result;\n \t};\n\n \t// The module cache\n \tvar installedModules = {};\n\n \t// objects to store loaded and loading chunks\n \tvar installedChunks = {\n \t\t1: 0\n \t};\n\n \t// The require function\n \tfunction __webpack_require__(moduleId) {\n\n \t\t// Check if module is in cache\n \t\tif(installedModules[moduleId]) {\n \t\t\treturn installedModules[moduleId].exports;\n \t\t}\n \t\t// Create a new module (and put it into the cache)\n \t\tvar module = installedModules[moduleId] = {\n \t\t\ti: moduleId,\n \t\t\tl: false,\n \t\t\texports: {}\n \t\t};\n\n \t\t// Execute the module function\n \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n\n \t\t// Flag the module as loaded\n \t\tmodule.l = true;\n\n \t\t// Return the exports of the module\n \t\treturn module.exports;\n \t}\n\n \t// This file contains only the entry chunk.\n \t// The chunk loading function for additional chunks\n \t__webpack_require__.e = function requireEnsure(chunkId) {\n \t\tvar installedChunkData = installedChunks[chunkId];\n \t\tif(installedChunkData === 0) {\n \t\t\treturn new Promise(function(resolve) { resolve(); });\n \t\t}\n\n \t\t// a Promise means \"currently loading\".\n \t\tif(installedChunkData) {\n \t\t\treturn installedChunkData[2];\n \t\t}\n\n \t\t// setup Promise in chunk cache\n \t\tvar promise = new Promise(function(resolve, reject) {\n \t\t\tinstalledChunkData = installedChunks[chunkId] = [resolve, reject];\n \t\t});\n \t\tinstalledChunkData[2] = promise;\n\n \t\t// start chunk loading\n \t\tvar head = document.getElementsByTagName('head')[0];\n \t\tvar script = document.createElement('script');\n \t\tscript.type = 'text/javascript';\n \t\tscript.charset = 'utf-8';\n \t\tscript.async = true;\n \t\tscript.timeout = 120000;\n\n \t\tif (__webpack_require__.nc) {\n \t\t\tscript.setAttribute(\"nonce\", __webpack_require__.nc);\n \t\t}\n \t\tscript.src = __webpack_require__.p + \"\" + chunkId + \".\" + \"743d69922007585e8c8d\" + \".js\";\n \t\tvar timeout = setTimeout(onScriptComplete, 120000);\n \t\tscript.onerror = script.onload = onScriptComplete;\n \t\tfunction onScriptComplete() {\n \t\t\t// avoid mem leaks in IE.\n \t\t\tscript.onerror = script.onload = null;\n \t\t\tclearTimeout(timeout);\n \t\t\tvar chunk = installedChunks[chunkId];\n \t\t\tif(chunk !== 0) {\n \t\t\t\tif(chunk) {\n \t\t\t\t\tchunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));\n \t\t\t\t}\n \t\t\t\tinstalledChunks[chunkId] = undefined;\n \t\t\t}\n \t\t};\n \t\thead.appendChild(script);\n\n \t\treturn promise;\n \t};\n\n \t// expose the modules object (__webpack_modules__)\n \t__webpack_require__.m = modules;\n\n \t// expose the module cache\n \t__webpack_require__.c = installedModules;\n\n \t// define getter function for harmony exports\n \t__webpack_require__.d = function(exports, name, getter) {\n \t\tif(!__webpack_require__.o(exports, name)) {\n \t\t\tObject.defineProperty(exports, name, {\n \t\t\t\tconfigurable: false,\n \t\t\t\tenumerable: true,\n \t\t\t\tget: getter\n \t\t\t});\n \t\t}\n \t};\n\n \t// getDefaultExport function for compatibility with non-harmony modules\n \t__webpack_require__.n = function(module) {\n \t\tvar getter = module && module.__esModule ?\n \t\t\tfunction getDefault() { return module['default']; } :\n \t\t\tfunction getModuleExports() { return module; };\n \t\t__webpack_require__.d(getter, 'a', getter);\n \t\treturn getter;\n \t};\n\n \t// Object.prototype.hasOwnProperty.call\n \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n\n \t// __webpack_public_path__\n \t__webpack_require__.p = \"\";\n\n \t// on error function for async loading\n \t__webpack_require__.oe = function(err) { console.error(err); throw err; };\n\n\n\n// WEBPACK FOOTER //\n// webpack/bootstrap 743d69922007585e8c8d"],
    "sourceRoot": ""
}
```

## 安全

>  SourceMappingURL 可以通过 js 修改，所以可能存在  CSP 安全问题，不过生效的前提是开启了开发者模式，详情[参考](https://weizman.github.io/?javascript-anti-debugging-some-next-level-shit-part-1)