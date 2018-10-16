import React, {
  ReactNode,
  SFC,
} from 'react';

interface ClickableProps {
  callback: Function;
  children: ReactNode;
};

const Clickable: SFC<ClickableProps> = ({
  callback,
  children,
}) => {
  return (
    <div onClick={callback.bind(null)}>
      {children}
    </div>
  );
};

export default Clickable;
