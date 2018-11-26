import React, {
  ReactElement,
  ReactNode,
  SFC,
  ChangeEvent,
} from 'react';
import {
  Select,
  Row,
  Input,
  Popover,
  InputNumber,
  Col,
} from 'antd';
import {
  SelectValue,
} from 'antd/lib/select';

import {
  PersonInfoProps,
  PersonInfoInterface,
  CO,
} from '../../types';
import {
  without,
} from '../../utils';
import {
  defaultNone,
} from '../../utils/constant';

const Option = Select.Option;
const styles = require('./Starter.less');

const PersonInfo: SFC<PersonInfoProps> = ({
  list,
  result,
  calcCallback,
  count,
  max,
}) => {
  //
  const genExplain: (explains: Array<string>) => ReactNode = (explains = [defaultNone]) => (
    <div>{explains.map(explain => <p key={explain}>{explain}</p>)}</div>
    );

  //
  const genOptions: (
    arr: Array<string>,
    keyMap: CO,
    selectedArr: Array<string>,
    keyExplain?: CO,
  ) => Array<ReactNode> = (
    arr,
    keyMap,
    selectedArr,
    keyExplain = {},
  ) => {
    return (
      arr.map(item => (
          <Option
            key={item}
            disabled={count + keyMap[item] > max && without(selectedArr, item)}
          >
            <Popover
              trigger="hover"
              placement="right"
              content={genExplain(keyExplain[item])}
              title={item}
            >
              <div className={styles['full-option']}>{item}</div>
            </Popover>
          </Option>
        ))
    )
  };

  //
  const calculate: (selectionMap: CO) => number = (selectionMap) => (
    list.reduce((res: number, info: CO): number => {
      const selections = selectionMap[info.key];
      if (selections && 'length' in selections && selections.length) {
        res += selections.reduce((sCount: number, selection: string): number => {
          sCount += info.keyObject[selection];
          return sCount;
        }, 0);
      }
      return res;
    }, 0)
    );

  //
  const getPersonRow: (
    rowInfo: PersonInfoInterface,
    defaultValue?: Array<string>|void,
  ) => ReactNode = (
    rowInfo,
    defaultValue,
  ) => {
    const {
      title,
      key: resKey,
      keyArray: value,
      keyObject: map,
      keyExplain: explain,
      placeholder,
    } = rowInfo;

    const handleSelectionChange: (returnValue: SelectValue, options: ReactElement<any>|ReactElement<any>[]) => void = (returnValue) => {
      result[resKey] = returnValue;
      count = calculate(result);
      calcCallback(count, result);
    };

    return (
      <Row key={resKey} type={'flex'} gutter={8} align={'middle'} justify={'start'} className={styles.mb20}>
        <Col span={6} offset={3} className={styles.tc}>{title}</Col>
        <Col span={12}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={placeholder}
            defaultValue={defaultValue || []}
            onChange={handleSelectionChange}
          >
            {genOptions(value, map, result[resKey] || [], explain)}
          </Select>
        </Col>
      </Row>
      );
  };

  //
  const handleNameChange: (evt: ChangeEvent<Element>) => void = (evt) => {
    result.name = evt.target.getAttribute('value') || '';
  };

  //
  const handleAgeChange: (evt: string|number|void) => void = (evt) => {
    result.age = Number(evt);
  };

  return (
    <div>
      <Row type={'flex'} gutter={8} align={'middle'} justify={'start'} className={styles.mb20}>
        <Col span={6} offset={3} className={styles.tc}>name</Col>
        <Col span={12}>
          <Input placeholder="please input your name" onChange={handleNameChange}/>
        </Col>
      </Row>
      <Row type={'flex'} gutter={8} align={'middle'} justify={'start'} className={styles.mb20}>
        <Col span={6} offset={3} className={styles.tc}>age</Col>
        <Col span={12}>
          <InputNumber min={16} max={30} defaultValue={16} onChange={handleAgeChange} />
        </Col>
      </Row>
      {
        list.map((info: PersonInfoInterface): ReactNode => (
          getPersonRow(info, result[info.key])
          ))
      }
    </div>
    );
};

export default PersonInfo;
