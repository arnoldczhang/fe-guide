/**
 * markjs
 */
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(global) :
  typeof define === 'function' && define.amd ? define(factory) :
    (global.mark = factory(global));
} (this || window, function (w) {'use strict';

  var REGEXP = {
    markPrefix: /([#>-`!\=_-\d\["\|\*])/,
    markInnerfix: /([\*_`])((?:[\*_`]|[^\n\r]+))([\*_`])/,
    emptyLine: /\n+/g,
    emptyLinePre: /^\n+/,
    emptyLinePreEnd: /^\n+|\n+$/g,
    line: /([^\n]+)\n/,
    hn: /(#{1,6})\s*([\s\S]+)(#*$)/,
    starWord: /(\*{1,4})((?:[^\*]+|\*))(\*{1,4})/,
    listWord: /([\*\+-])\s+([\s\S]*)/,
    hashEnd: /#*$/,
  };

  var CONSTANT = {
    SPACE: 4,
  }

  /**
   * Utils
   */
  var isArray = Array.isArray;
  function log() {
    Function.apply.call(console.log, console, arguments);
  };

  function toArray(arrayLike) {
    var length = arrayLike.length;
    var result;
    if (length) {
      result = new Array(length);
      for (var i = 0; i < length; i += 1) {
        result[i] = arrayLike[i];
      }
    }
    return result;
  };

  function extend(deep) {
    var args = toArray(arguments);
    var target = args[1] || {};
    var sourceArray = args.slice(2);
    var source;
    if (deep) {
      ;
    } else {
      for (var i = 0; i < sourceArray.length; i += 1) {
        source = sourceArray[i];
        for (var key in source) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

  function getRepeat(num, word) {
    return new Array(num).join(word || ' ');
  };

  function clearMultiLine(input) {
    return (input || '').replace(REGEXP.emptyLine, '\n');
  };

  function wrap(tagName, vnode, options) {
    var args = arguments;
    if (isArray(tagName)) {
      return multiWrap(tagName, vnode, function(tag) {
        return wrap(tag, vnode, options);
      });
    }
    var children = vnode.children;
    var startTag = '<' + tagName + '>';
    var endTag = '</' + tagName + '>';
    var prefix = vnode.getPrefix();
    var innerContent = children.length
      ? (renderChildren(children, options) + '\n')
      : vnode.content;

    if (prefix) startTag = getRepeat(prefix) + startTag;
    if (isContainer(vnode.type)) {
      if (vnode.parent && isContainer(vnode.parent.type)) {
        startTag = '\n' + startTag + '\n';
      }
      endTag = getRepeat(prefix) + endTag;
    } else if (isFirstGenChild(vnode)) {
      startTag = '\n' + startTag;
    }

    if (options.newLine) {
      endTag += options.isLast ? '' : '\n';
    }
    return startTag + innerContent + endTag;
  };

  function multiWrap(tagArray, vnode, callback) {
    var tag;
    var line;
    var startTag = '';
    var endTag = '';
    var prefix = vnode.getPrefix() || 0;
    while (tagArray.length > 1) {
      tag = tagArray.shift();
      line = prefix ? '' : '\n';
      startTag += line + getRepeat(prefix) + '<' + tag + '>\n';
      endTag = getRepeat(prefix) + '</' + tag + '>' + line + endTag + '\n';
      prefix += CONSTANT.SPACE;
    }
    vnode.prefix = prefix;
    return startTag + callback(tagArray[0]) + endTag;
  };

  function trim(string) {
    return string.replace(REGEXP.emptyLinePreEnd, '');
  };

  function isContainer(type) {
    return type === TYPE.CONTAINER;
  };

  function isFirstGenChild(vnode) {
    var lexer = vnode.lexer;
    return lexer && lexer.container
      && lexer.container === vnode.parent;
  }

  var defaultOptions = {
    newLine: false,
    isLast: false,
  };

  /**
   * Render
   */
  var TYPE = {};

  var TAG = {
    P: 'p',
  };

  var renderMap = {};

  function render(vnode, options) {
    return renderMap[vnode.type](vnode, options);
  };

  function renderChildren(children, options) {
    var lastIndex = children.length - 1;
    return children.map(function(vnode, index) {
      options.isLast = index === lastIndex;
      return render(vnode, options);
    }).join('');
  };

  function genRenderFunc(type, renderFunc) {
    TYPE[type.toUpperCase()] = type;
    renderMap[type] = renderFunc;
  };

  genRenderFunc('container', function containerWrap(vnode, options) {
    var props = vnode.props;
    var tagName = props.tagName || options.tagName || 'div';
    return wrap(tagName, vnode, options);
  });

  genRenderFunc('text', function textWrap(vnode, options) {
    options.newLine = true;
    return wrap('span', vnode, options);
  });

  genRenderFunc('h', function hWrap(vnode, options) {
    options.newLine = true;
    return wrap('h' + vnode.size, vnode, options);
  });

  genRenderFunc('list', function listWrap(vnode, options) {
    options.newLine = true;
    return wrap(['ul','li'], vnode, options);
  });

  genRenderFunc('word', function wordWrap(vnode, options) {
    var tags = [null, 'em', 'strong', ['strong', 'em'], ['strong', 'strong']][vnode.size];
    return wrap(tags, vnode, options);
  });

  /*
  * Parser
   */
  function parseHn(_this, prefix) {
    var line = _this.line.replace(REGEXP.hashEnd, '').match(REGEXP.hn);
    if (line) {
      _this.append({
        type: TYPE.H,
        content: line[2],
        prefix: _this.prefix,
        size: line[1].length,
      });
      _this.toNext();
    }
  };

  function parseNorm(_this, prefix) {
    _this.append({
      type: TYPE.TEXT,
      content: _this.getLineContent(),
      prefix: _this.prefix,
    });
    _this.toNext();
  };

  function parseStar(_this, prefix) {
    var result = _this.line.match(REGEXP.starWord);
    if (result) {
      _this.append({
        type: TYPE.WORD,
        content: result[2],
        prefix: _this.prefix,
        size: result[1].length,
      });
    } else {
      result = _this.line.match(REGEXP.listWord);
      if (result) {
        _this.append({
          type: TYPE.LIST,
          content: result[2],
          prefix: _this.prefix,
          sign: result[1],
        });
      }
    }
    _this.toNext(result[0].length);
  };

  /**
   * VNode
   */
  function VNode(props) {
    props = extend(false, {}, this.defaultProps, props || {});
    this.props = props;
    this.children = [];
    extend(false, this, props);
  };
  
  var vNodeProto = VNode.prototype;
  vNodeProto.defaultProps = {
    type: TYPE.CONTAINER,
    content: '',
  };

  vNodeProto.appendVNode = function appendVNode(vNode) {
    this.children.push(vNode);
    vNode.parent = this;
  };

  vNodeProto.getPrefix = function getPrefix() {
    var parent = this.parent;
    var prefix = this.prefix || 0;
    while (parent) {
      prefix += parent.prefix || 0;
      parent = parent.parent;
    }
    return prefix;
  };

  /**
   * Lexer
   */
  function Lexer(input, options) {
    this.options = Object.create(options);
    this.string = input;
    this.prefix = CONSTANT.SPACE; // 前置空格数
    this.initFlag = true;
    this.line = ''; // 单行内容
    this.index = 0; // 当前索引
    this.parent = this.container = new VNode();
    this.times = 0;
  };

  Lexer.maxTimes = 100;
  Lexer.parseMap = {
    '#': parseHn,
    '*': parseStar,
  };

  var lexerProto = Lexer.prototype;
  lexerProto.resetIndex = function resetIndex(index) {
    index = arguments.length ? index : 0;
    this.index = index;
  };

  lexerProto.hasNext = function hasNext() {
    if (this.times >= Lexer.maxTimes) return;
    this.times += 1;
    this.needWrapper = REGEXP.emptyLinePre.test(this.string) || this.initFlag;
    if (this.needWrapper) {
      this.string = trim(this.string);
      if (this.parent.parent) {
        this.parent = this.parent.parent;
      }
    }
    this.initFlag = false;
    return this.string.length;
  };

  lexerProto.hasMarkContent = function hasMarkContent() {
    this.updateLineIndex();
    var firstChar = this.string[0];
    var result, index;
    result = REGEXP.markPrefix.exec(firstChar);
    if (result) {
      this.markPrefix = result[1];
      this.needWrapper = false;
      return result;
    } else {
      result = REGEXP.markInnerfix.exec(this.string);
      if (result) {
        index = result.index;
        if (this.index > index) {
          this.index = index;
          this.tagName = 'p';
          return false;
        }
      }
    }
    this.needWrapper = false;
    return false;
  };

  lexerProto.updateLineIndex = function updateLineIndex() {
    this.index = this.string.indexOf('\n');
    this.end = this.index < 0;
    if (this.end) {
      this.index = this.string.length;
    }
    return this.index;
  };

  lexerProto.getLineContent = function getLineContent() {
    return this.string.substring(0, this.index);
  };

  lexerProto.transParent = function transParent(parent) {
    return this.parent = parent;
  };

  lexerProto.getParent = function getParent() {
    while(this.parent.parent) {
      this.parent = this.parent.parent;
    }
    return this.parent;
  };

  lexerProto.wrap = function wrap(props) {
    props = props || {};
    props.prefix = this.prefix;
    if (this.tagName) {
      props.tagName = this.tagName;
      this.tagName = null;
    }
    this.parent = this.append(props);
  };

  lexerProto.append = function append(props) {
    var childVNode = new VNode(props);
    childVNode.lexer = this;
    this.parent.appendVNode(childVNode);
    return childVNode;
  };

  lexerProto.getMarkString = function getMarkString(line) {
    this.line = line || this.getLineContent();
    if (this.needWrapper) this.wrap();
    Lexer.parseMap[this.markPrefix](this);
  };

  lexerProto.getNormalString = function getNormalString() {
    if (this.needWrapper) this.wrap();
    parseNorm(this);
  };

  lexerProto.toNext = function toNext(index) {
    index = arguments.length ? index : this.index;
    this.string = this.string.substr(index);
    this.resetIndex();
  };

  /**
   * Compiler
   */
  function Compiler(input, options) {
    var combNextLine = false;
    var lexer = new Lexer(input, options);
    while(lexer.hasNext()) {
      // FIXME table |
      if (lexer.hasMarkContent() || combNextLine) {
        if (combNextLine) {
          // TODO list
        } else {
          lexer.getMarkString();
        }
      } else {
        lexer.getNormalString();
      }
    }
    return lexer.getParent();
  };

  /**
   * mark
   */
  function mark(input, options, callback) {
    options = extend({}, defaultOptions, options || {});
    var vnode = new Compiler(input, options);
    return clearMultiLine(trim(render(vnode, options)));
  };
  return mark;
}));