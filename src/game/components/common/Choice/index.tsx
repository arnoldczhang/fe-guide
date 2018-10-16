import React, {
  SFC,
} from 'react';
import classnames from 'classnames';

import { Weapon } from '../../../types';

const styles = require('./index.less');

interface ChoiceProps {
  clickable: boolean;
  selected: boolean;
  reload: boolean;
  item: Weapon;
  callback: Function;
};

const Choice: SFC<ChoiceProps> = ({
  clickable,
  selected,
  reload,
  item,
  callback,
}) => {
  
  const handleChoiceClick: () => void = () => {
    const withoutTimes = !('times' in item);
    const times = withoutTimes ? 0 : item.times || 0;

    if (clickable) {
      if (withoutTimes) {
        callback();
      } else if (times > 0) {
        item.times = times - 1;
        callback();
      }
    }
  };

  const choiceContainerClass = classnames({
    [styles['choice-container']]: true,
    [styles['choice-tips']]: 'times' in item,
  });

  const choiceClass = classnames({
    [styles.choice]: true,
    [styles[`choice-loading-${item.cost || 3}`]]: reload,
    [styles['choice-selected']]: selected,
  });
  
  return (
    <div className={choiceContainerClass} data-times={item.times || 0}>
      <div className={choiceClass} onClick={handleChoiceClick}>
        {item.icon ? <img className={styles['choice-img']} src={item.icon} /> : null}
        {item.title ? <span className={styles['choice-word']}>{item.title}</span> : null}
      </div>
    </div>
  );
};

export default Choice;
