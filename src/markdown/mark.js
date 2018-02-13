/**
 * markjs
 * @param  {[type]} global  [description]
 * @param  {[type]} factory [description]
 * @return {[type]}         [description]
 */
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(global) :
  typeof define === 'function' && define.amd ? define(factory) :
    (global.mark = factory(global));
} (this || window, function (w) {'use strict';

  var REGEXP = {
    markPrefix: /([#>-`!\=_-\d\["\|\*])/,
    markInnerfix: /([\*_`])((?:[\*_`]|[^\n\r]+))([\*_`])/,
    emptyLine: /^\n+|\n+$/g,
    line: /([^\n]+)\n/,
    hn: /(#+)\s*([\s\S]+)(#*$)/,
    starWord: /(\*+)((?:[^\*]+|\*))(\*+)/,
    hashEnd: /#*$/,
  };

  /**
   * Utils
   */
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

  function wrap(tagName, vnode, options) {
    var children = vnode.children;
    var startTag = '<' + tagName + '>';
    var endTag = '</' + tagName + '>';
    var innerContent = children.length
      ? ('\n' + renderChildren(children, options) + '\n')
      : vnode.content;

    if (vnode.prefix) {
      startTag = getRepeat(vnode.prefix) + startTag;
    }

    if (options.newLine) {
      endTag += options.isLast ? '' : '\n';
    }
    return startTag + innerContent + endTag;
  };

  function trim(string) {
    return string.replace(REGEXP.emptyLine, '');
  };

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

  genRenderFunc('container', function(vnode, options) {
    var tagName = options.tagName || 'div';
    return wrap(tagName, vnode, options);
  });

  genRenderFunc('text', function(vnode, options) {
    options.newLine = true;
    return wrap('span', vnode, options);
  });

  genRenderFunc('h', function(vnode, options) {
    options.newLine = true;
    return wrap('h' + vnode.size, vnode, options);
  });

  genRenderFunc('list', function(vnode, options) {

  });

  genRenderFunc('word', function(vnode, options) {

  });

  /*
  * Parser
   */
  function parseHn(_this) {
    var line = _this.line.replace(REGEXP.hashEnd, '').match(REGEXP.hn);
    if (line) {
      _this.append({
        type: TYPE.H,
        content: line[2],
        prefix: _this.space,
        size: line[1].length,
      });
      _this.toNext();
    }
  };

  function parseNorm(_this) {
    _this.append({
      type: TYPE.TEXT,
      content: _this.getLineContent(),
      prefix: _this.space,
    });
    _this.toNext();
  };

  function parseStar(_this) {
    var result = _this.line.match(REGEXP.starWord);
    if (result) {
      _this.append({
        type: TYPE.TEXT,
        content: result[2],
        prefix: _this.space,
        size: result[1].length,
      });
      _this.toNext(result[0].length);
    }
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
    // vNode.parent = this;
  };

  /**
   * Lexer
   */
  function Lexer(input, options) {
    this.options = Object.create(options);
    this.string = input;
    this.space = 4; // 前置空格数
    this.line = ''; // 单行内容
    this.index = 0; // 当前索引
    this.parent = new VNode();
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
    return this.string.length;
  };

  lexerProto.hasMarkContent = function hasMarkContent() {
    this.updateLineIndex();
    var firstChar = this.string[0];
    var lineResult, firstResult, index;
    firstResult = REGEXP.markPrefix.exec(firstChar);
    if (firstResult) {
      this.markPrefix = firstResult[1];
      return firstResult;
    }
    lineResult = REGEXP.markInnerfix.exec(this.string);
    if (lineResult) {
      index = lineResult.index;
      this.needWrapper = this.index > index;
      if (this.needWrapper) {
        this.index = index;
      }
    }
    return false;
  };

  lexerProto.updateLineIndex = function updateLineIndex() {
    this.index = this.string.indexOf('\n');
    if (this.index < 0) {
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

  lexerProto.getVNode = function getVNode() {
    return this.parent;
  };

  lexerProto.wrap = function wrap(props) {
    props = props || {};
    this.parent = this.append(props);
  };

  lexerProto.append = function append(props) {
    var childVNode = new VNode(props);
    this.parent.appendVNode(childVNode);
    return childVNode;
  };

  lexerProto.getParent = function getParent(vnode) {
    return (vnode || this.parent).parent;
  };

  lexerProto.getMarkString = function getMarkString(line) {
    this.line = line || this.getLineContent();
    if (this.needWrapper) this.wrap();
    Lexer.parseMap[this.markPrefix](this);
  };

  lexerProto.getNormalString = function getNormalString() {
    // if (this.needWrapper) this.wrap();
    parseNorm(this);
  };

  lexerProto.toNext = function toNext(index) {
    index = arguments.length ? index : this.index;
    this.string = trim(this.string.substr(index));
    this.resetIndex();
  };

  /**
   * Compiler
   */
  function Compiler(input, options) {
    var combNextLine = false;
    input = trim(input);
    var lexer = new Lexer(input, options);
    while(lexer.hasNext()) {
      // FIXME table |
      if (lexer.hasMarkContent() || combNextLine) {
        if (combNextLine) {

        } else {
          lexer.getMarkString();
        }
      } else {
        lexer.getNormalString();
      }
    }
    return lexer.getVNode();
  };

  /**
   * mark
   */
  function mark(input, options, callback) {
    options = extend({}, defaultOptions, options || {});
    var vnode = new Compiler(input, options);
    // log(vnode);
    return render(vnode, options);
  };
  return mark;
}));