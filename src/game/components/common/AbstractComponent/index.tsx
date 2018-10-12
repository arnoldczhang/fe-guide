import { Component } from 'react';

export default interface AbstractComponent<P, S> extends Component<P, S>{
  bindInstance(): void;
}
