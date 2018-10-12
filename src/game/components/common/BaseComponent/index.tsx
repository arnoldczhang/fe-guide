import { PureComponent } from 'react';
import {
  Modal,
  message,
} from 'antd';
import {
  ModalFuncProps,
} from 'antd/lib/modal';

export default class BaseComponent<P = {}, S = {}, SS = any> extends PureComponent<P, S, SS> {
  constructor(props: P) {
    super(props);
  }

  confirm(config: ModalFuncProps): void {
    Modal.confirm(config);
  }

  toast(word: string): void {
    message.info(word);
  }
}
