import { Stage } from '../enum';

export interface AppInterface {
  stage: Stage,
}

export type AppState = Partial<{
  show: boolean;
}>;

export type AppProps = Partial<{
  children?: React.ReactNode;
  dispatch?: Function|any;
  stage: Stage;
}>;

