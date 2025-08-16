import { CF } from "../types";

export class Comp {
  public tag: string;
  public path: string;
  public src: string;
  public children: Comp[];
  constructor(
    tag: string,
    path: string,
    src: string,
    children: Comp[] = [],
  ) {
    this.tag = tag;
    this.path = path;
    this.src = src;
    this.children = children;
  }

  public iterateChild(cb: CF) {
    if (this.children && this.children.length) {
      this.children.forEach((child: Comp) => {
        cb(child);
        child.iterateChild(cb);
      });
    }
  }

  public addChild(item: Comp) {
    this.children.push(item);
  }
}
