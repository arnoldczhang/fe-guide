import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Steps,
} from 'antd';

import AbstractComponent from '../common/AbstractComponent';
import BaseComponent from '../common/BaseComponent';
import ErrorBoundary from '../common/ErrorBoundary';
import StepButton from './StepButton';
import PersonInfo from './PersonInfo';
import System from './System';
import BirthMap from './BirthMap';
import { StarterState, StarterProps, AreaInfo } from '../../types';
import { Stage, CreateStep } from '../../enum';
import selector from '../../selectors/starter';
import { dispatch } from '../../store';
import {
  defaultSystemList,
  defaultPersonInfoList,
  mapInfo,
} from '../../utils/constant';

const Step = Steps.Step;

const styles = require('./Starter.less');

const initialState: StarterState = {
  point: 10,
  count: 0,
  maxPoint: 10,
  maxStep: 2,
  config: {
    name: 'dfwm',
    age: 16,
  },
  map: mapInfo,
  lastMapOuterIndex: 0,
  lastMapInnerIndex: 0,
  selectedArea: null,
  refreshed: false,
};

const initialProps = {
  stage: Stage.Create_0,
  stepIndex: CreateStep.Person,
};

class Starter extends BaseComponent<StarterProps, StarterState> implements AbstractComponent<StarterProps, StarterState> {
  displayName?: string = 'Starter';
  state: StarterState = initialState;
  static defaultProps = initialProps;

  constructor(props: StarterProps) {
    super(props);
    this.bindInstance();
  }

  bindInstance(): void {
    this.calculate = this.calculate.bind(this);
    this.goPrev = this.goPrev.bind(this);
    this.goNext = this.goNext.bind(this);
    this.selectBirthPlace = this.selectBirthPlace.bind(this);
  }

  isPointUsed(): boolean {
    return this.state.point <= 0;
  }

  getCurrentStage(index: CreateStep): Stage {
    return [Stage.Create_0, Stage.Create_1, Stage.Create_2][index];
  }

  updateStage(step: number): void {
    const { stepIndex } = this.props;
    const stage = this.getCurrentStage(stepIndex + step);
    dispatch.app.updateStage(stage);
  }

  goPrev(): void {
    dispatch.starter.prevStep();
    this.updateStage(-1);
  }

  goNext(): void {
    const { stepIndex } = this.props;
    const { config } = this.state;

    const goNextStep = () => {
      dispatch.starter.nextStep();
      this.updateStage(1);
    };

    switch (stepIndex) {
      case CreateStep.Person:
        if (this.isPointUsed()) {
          goNextStep();
        } else {
          this.confirm({
            title: 'tip',
            content: 'points has still remaining, continue?',
            onOk(): void {
              goNextStep();
            },
          });
        }
        break;
      case CreateStep.System:
        goNextStep();
        break;
      case CreateStep.Finish:
        dispatch.app.initWorld(config);
        break;
    }
  }

  calculate(count: number): void {
    const {
      maxPoint,
    } = this.state;
    this.setState({
      count,
      point: maxPoint - count,
    });
  }

  selectBirthPlace(outer: number, inner: number) {
    const {
      lastMapOuterIndex,
      lastMapInnerIndex,
    } = this.state;
    const map: Array<Array<AreaInfo>> = Object.assign([], mapInfo);
    map[lastMapOuterIndex][lastMapInnerIndex].selected = false;
    map[outer][inner].selected = true;
    this.setState({
      selectedArea: map[outer][inner],
      map,
      lastMapOuterIndex: outer,
      lastMapInnerIndex: inner,
    });
  }

  getStepView(): ReactNode|Array<ReactNode> {
    const {
      stepIndex,
    } = this.props;
    const {
      config,
      point,
      count,
      maxPoint,
      map,
      selectedArea,
    } = this.state;

    switch (stepIndex) {
      case 2:
        return (
          <BirthMap
            info={map}
            clickCallback={this.selectBirthPlace}
            selectedArea={selectedArea}
           />
        );
      case 1:
        return (
          <System result={config} list={defaultSystemList} />
          );
      case 0:
      default:
        return ([
          <PersonInfo
            result={config}
            list={defaultPersonInfoList}
            calcCallback={this.calculate}
            key={'PersonInfo'}
            count={count}
            max={maxPoint}
          />,
          <Row
            type={'flex'}
            gutter={8}
            align={'middle'}
            justify={'end'}
            key={'pointRow'}
          >
            <Col span={9}>point remain：{point}</Col>
          </Row>,
          ]);
    }
  }

  render(): ReactNode {
    const {
      stepIndex,
    } = this.props;
    const {
      maxStep,
    } = this.state;

    return (
      <ErrorBoundary className={styles.starter}>
          <Row gutter={8}>
            <Col span={12} offset={6} className={styles['main-box']}>
              <h1 className={classnames(styles['tc'])}>create character</h1>
              <Steps current={stepIndex}>
                <Step title="person info" description='&nbsp;' />
                <Step title="system config" description='&nbsp;' />
                <Step title="finish" description='&nbsp;' />
              </Steps>
              {this.getStepView()}
              <StepButton
                index={stepIndex}
                maxIndex={maxStep}
                prevFunc={this.goPrev}
                nextFunc={this.goNext}
                finishWord={'complete'}
              />
            </Col>
          </Row>
      </ErrorBoundary>
      );
  }
}

export default connect(selector)(Starter);
