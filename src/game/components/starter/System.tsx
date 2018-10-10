import {
  SFC,
  ReactNode,
} from 'react';
import {
  Radio,
  Row,
  Col,
} from 'antd';
import {
  RadioChangeEvent,
} from 'antd/lib/radio';

import {
  func,
} from '../../utils';
import {
  SystemProps,
  SystemConfigInterface,
} from '../../types';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const styles = require('./Starter.less');

const System: SFC<SystemProps> = ({
  list,
  result,
  selectCallback = func,
}) => {

  const getRadioGroup: (
    config: SystemConfigInterface,
    radioValue: string,
  ) => ReactNode = (
    config,
    radioValue,
  ) => {
    const onChange = (evt: RadioChangeEvent) => {
      result[config.key] = evt.target.value;
      selectCallback(result);
    };

    return (
      <div className={styles.mb20} key={`${config.key}_radio`}>
        <label className={styles['system-label']}>{config.title}</label>
        <RadioGroup onChange={onChange} defaultValue={radioValue || config.defaultValue || ''}>
          {
            config.keyArray.map((key: string): ReactNode => (
              <RadioButton value={key} key={key}>{key}</RadioButton>
              ))
          }
        </RadioGroup>
      </div>
      );
  };

  return (
    <Row type={'flex'} gutter={8} align={'middle'} justify={'center'}>
      <Col>
      {
        list.map(item => (
          getRadioGroup(item, result[item.key])
          ))
      }
      </Col>
    </Row>
    );
};

export default System;
