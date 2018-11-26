import React, {
  SFC,
  ReactNode,
} from 'react';
import {
  Row,
  Col,
  Button,
} from 'antd';

import { StepButtonProps } from '../../types';

/*
无状态组件定义规则：https://stackoverflow.com/questions/47833338/event-handling-inside-stateless-functional-components-in-react-typescript
 */
const StepButton: SFC<StepButtonProps> = ({
  prevFunc,
  nextFunc,
  prevWord = 'prev step',
  nextWord = 'next step',
  finishWord = 'next step',
  index = 0,
  maxIndex = 2,
}) => {
  const getPrevBtn: () => ReactNode|void = () => (
    index > 0 && index <= maxIndex ? (
      <Col>
        <Button type="primary" onClick={prevFunc}>{prevWord}</Button>
      </Col>
    ) : null
    );

  const getNextBtn: () => ReactNode = () => (
    <Col>
      <Button type="primary" onClick={nextFunc}>{index < maxIndex ? nextWord : finishWord}</Button>
    </Col>
    );

  return (
    <Row type={'flex'} gutter={8} align={'middle'} justify={'center'}>
      {getPrevBtn()}
      {getNextBtn()}
    </Row>
    );
};

export default StepButton;
