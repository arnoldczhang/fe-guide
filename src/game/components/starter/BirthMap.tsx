import {
  SFC,
  ReactNode,
} from 'react';
import {
  Row,
  Col,
} from 'antd';

import {
  BirthMapProps,
  AreaInfo,
} from '../../types';

const styles = require('./Starter.less');

const BirthMap: SFC<BirthMapProps> = ({
  info,
  clickCallback,
  selectedArea,
}) => {
  const clickHandler: (
    outerIndex: number,
    innerIndex: number,
  ) => void = (
    outerIndex,
    innerIndex,
  ) => {
    clickCallback(outerIndex, innerIndex);
  };

  const getRenderedMap: (mapInfo: Array<Array<AreaInfo>>) => ReactNode[] = (mapInfo) => (
    mapInfo.map((map: Array<AreaInfo>, index: number): ReactNode => (
      <Row
        key={`map_${index}`}
        type={'flex'}
        gutter={0}
        align={'middle'}
        justify={'center'}
      >
        {
          map.map((area: AreaInfo, innerIndex: number): ReactNode => (
            <Col
              key={area.key}
              span={6}
              className={styles.area}
              onClick={clickHandler.bind(null, index, innerIndex)}
              style={{
                backgroundColor: area.selected ? area.color : '#fff',
                color: area.selected ? '#fff' : '#000',
              }}
            >{area.title}</Col>
            ))
        }
      </Row>
      ))
  );

  const getMapIntro: () => ReactNode|void = () => {
    if (selectedArea) {
      let {
        martial,
      } = selectedArea;
      martial = martial || {};

      return (
        <Col span={9}>
          <Row>
            <Col className={styles.tc}>{selectedArea.title}</Col>
          </Row>
          <Row>
            <Col className={styles.tc}>{selectedArea.content}</Col>
          </Row>
          {
            Object.keys(martial).map((artKey: string): ReactNode => (
              <Row>
                <Col>{artKey}</Col>
                <Col>{(martial[artKey] || []).map(item => item)}</Col>
              </Row>
              ))
          }
        </Col>
        );
    }
    return null;
  };

  return (
    <Row className={styles.mb20} type={'flex'} gutter={0} align={'top'} justify={'center'}>
      <Col span={12} className={styles['map-container']}>
        {getRenderedMap(info)}
      </Col>
      {getMapIntro()}
    </Row>
    );
};

export default BirthMap;
