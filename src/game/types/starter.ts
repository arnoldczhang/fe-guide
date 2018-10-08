import { Stage } from '../enum';

export interface starterInterface {
}

export type StarterState = Partial<{
}>;

export type StarterProps = Partial<{
  children: React.ReactNode;
  dispatch: Function|any;
  stage?: Stage;
}>;

