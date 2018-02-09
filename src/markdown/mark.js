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
    markPrefix: /#>-`!=-\*\d\["/,
    emptyLine: /\n/,
  };

  /**
   * [TYPE description]
   * @type {Object}
   */
  var TYPE = {
    CONTAINER: 'container',
    WORD: 'word',
    LIST: 'list',
  };

  /**
   * [TAG description]
   * @type {Object}
   */
  var TAG = {
    P: 'p',
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

  /**
   * VNode
   */
  function VNode(props) {
    props = props || this.defaultProps;
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
  function Lexer(input) {
    this.string = input;
    this.index = 0;
    this.parent = new VNode();
  };

  var lexerProto = Lexer.prototype;
  lexerProto.resetIndex = function resetIndex() {
    this.index = 0;
  };

  lexerProto.next = function next() {
    console.log(this.string);
    this.nowChar = this.string[this.index];
    return this.nowChar || false;
  };

  lexerProto.hasMarkPre = function hasMarkPre() {
    return REGEXP.markPrefix.test(this.nowChar);
  };

  lexerProto.getNormalStr = function getNormalStr() {
    var index = this.string.indexOf('\n');
    if (index < 0) {
      index = this.string.length;
    }
    this.append({
      type: TYPE.WORD,
      content: this.string.substring(0, index),
    });
    this.toNextLine(index);
  };

  lexerProto.transParent = function transParent(parent) {
    this.parent = parent;
  };

  lexerProto.getVNode = function getVNode(parent) {
    return this.parent;
  };

  lexerProto.append = function append(props) {
    var childVNode = new VNode(props);
    this.parent.appendVNode(childVNode);
  };

  lexerProto.toNextLine = function toNextLine(index) {
    this.string = this.string.substr(index);
    this.resetIndex();
  };

  /**
   * [Compiler description]
   * @param {[type]} input   [description]
   * @param {[type]} options [description]
   */
  function Compiler(input, options) {
    var combNextLine = false;
    input = input.trim();
    var lexer = new Lexer(input);
    while(lexer.next()) {
      if (lexer.hasMarkPre() || combNextLine) {

      } else {
        lexer.getNormalStr();
      }
    }
    return lexer.getVNode();
  };

  /**
   * [Render description]
   * @param {[type]} vnodes [description]
   */
  function Render(vnodes) {
    console.log(vnodes);
  };

  /**
   * mark
   * @param  {[type]}   input    [description]
   * @param  {[type]}   options  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  function mark(input, options, callback) {
    var vnodes = new Compiler(input, options);
    return new Render(vnodes);
  };

  return mark;
}));