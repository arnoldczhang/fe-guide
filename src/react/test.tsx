import * as React from 'react';
import { hydrate } from 'react-dom';

export interface Props {
  id?: number;
  children?: React.ReactNode;
}

export const Comp: React.FC<Props> = ({
  id = 11223,
}) => (
    <div>{id}</div>
);

export default function Foo(props: {}) {
  return <div>xxx</div>;
}

const Hello = ({
  id,
}: React.PropsWithChildren<Props>) => (
  <div>Hello {id}!</div>
);

Hello.defaultProps = {
  id: 123,
} as Partial<Props>;

hydrate(<Hello />, document.getElementById('root'));
