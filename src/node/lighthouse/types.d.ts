type LHState = 'init'
  | 'launch'
  | 'launchSuccess'
  | 'lighthouse'
  | 'lighthouseSuccess'
  | 'done';

type LHStateMap = {
  [P in LHState]: number;
};

type ReportMode = 'html'
  | 'json'
  | 'csv';

type LHHookNameType = 'beforeLaunch'
  | 'launched'
  | 'beforeLighthouse'
  | 'lighthoused'
  | 'compiled';

type LHHookName = {
  [P in LHHookNameType]: P;
};

type LHHook = {
  [P in LHHookNameType]?: Function[];
};

type LHOption = {
  initChromeConfig?: Function | null;
  initLighthouseConfig?: Function | null;
  hooks?: ICO,
};
