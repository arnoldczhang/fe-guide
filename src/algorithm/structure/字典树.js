// https://github.com/trekhleb/javascript-algorithms/blob/master/src/data-structures/trie/README.zh-CN.md
const { TrieNode } = require('./base');

class Trie {
  constructor() {
    this.root = new TrieNode('');
  }

  match(parent, node) {
    const { value: nodeValue } = node;
    const { value: parentValue } = parent;
    if (parentValue === '') {
      if (nodeValue.length === 1) {
        return true;
      }
    } else if (parentValue.length === nodeValue.length - 1) {
      return new RegExp(`^${parentValue}`).test(nodeValue);
    }
    return false;
  }

  insert(value, parent = this.root) {
    const node = new TrieNode(value);
    if (parent && this.match(parent, node)) {
      parent.child.push(node);
    }
  }
}

module.exports = Trie;
