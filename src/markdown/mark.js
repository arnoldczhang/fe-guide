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

  /**
   * [REGEXP description]
   * @type {Object}
   */
  var REGEXP = {
    markPrefix: /#>-`!=-\*\d\["\|/,
    emptyLine: /^\n+|\n+$/g,
    line: /([^\n]+)\n/,
  };

  /**
   * utils
   */
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
   * [TYPE description]
   * @type {Object}
   */
  var TYPE = {};

  /**
   * [TAG description]
   * @type {Object}
   */
  var TAG = {
    P: 'p',
  };

  var renderMap = {};

  function genRenderFunc(type, renderFunc) {
    TYPE[type.toUpperCase()] = type;
    renderMap[type] = renderFunc;
  };


  // init render func
  genRenderFunc('container', function(vnode, options) {
    var tagName = options.tagName || 'div';
    return wrap(tagName, vnode, options);
  });

  genRenderFunc('text', function(vnode, options) {
    options.newLine = true;
    return wrap('p', vnode, options);
  });

  genRenderFunc('h', function(vnode, options) {
    options.newLine = true;
    return wrap('p', vnode, options);
  });

  genRenderFunc('list', function(vnode, options) {

  });

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
  };

  /**
   * Lexer
   * @param {[type]} input [description]
   */
  function Lexer(input, options) {
    this.options = options;
    this.string = input;
    this.index = 0;
    this.times = 0;
    this.parent = new VNode();
  };

  var lexerProto = Lexer.prototype;
  lexerProto.maxTimes = 10;
  lexerProto.resetIndex = function resetIndex() {
    this.index = 0;
  };

  lexerProto.next = function next() {
    if (this.times >= this.maxTimes) return;
    this.times += 1;
    this.nowChar = this.string[this.index];
    return this.nowChar || false;
  };

  lexerProto.hasMarkPre = function hasMarkPre() {
    return REGEXP.markPrefix.test(this.nowChar);
  };

  lexerProto.getMarkStr = function getMarkStr() {
    var input = this.string.match(REGEXP.line, '');
    if (input) {
      input = input[1];

    }
  };

  lexerProto.getNormalStr = function getNormalStr(space) {
    var index = this.string.indexOf('\n');
    if (index < 0) {
      index = this.string.length;
    }
    this.append({
      type: TYPE.TEXT,
      content: this.string.substring(0, index),
      prefix: space,
    });
    this.toNextLine(index);
  };

  lexerProto.transParent = function transParent(parent) {
    return this.parent = parent;
  };

  lexerProto.getVNode = function getVNode() {
    return this.parent;
  };

  lexerProto.append = function append(props) {
    var childVNode = new VNode(props);
    this.parent.appendVNode(childVNode);
  };

  lexerProto.toNextLine = function toNextLine(index) {
    this.string = trim(this.string.substr(index));
    this.resetIndex();
  };

  /**
   * [Compiler description]
   * @param {[type]} input   [description]
   * @param {[type]} options [description]
   */
  function Compiler(input, options) {
    var combNextLine = false;
    var preSpace = 4;
    input = trim(input);
    var lexer = new Lexer(input, options);
    while(lexer.next()) {
      // TODO table |
      if (lexer.hasMarkPre() || combNextLine) {
        if (combNextLine) {

        } else {
          lexer.getMarkStr();
        }
      } else {
        lexer.getNormalStr(preSpace);
      }
    }
    return lexer.getVNode();
  };

  /**
   * [render description]
   * @param {[type]} vnodes [description]
   */
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

  /**
   * mark
   * @param  {[type]}   input    [description]
   * @param  {[type]}   options  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  function mark(input, options, callback) {
    options = extend({}, defaultOptions, options || {});
    var vnode = new Compiler(input, options);
    return render(vnode, options);
  };

  return mark;
}));