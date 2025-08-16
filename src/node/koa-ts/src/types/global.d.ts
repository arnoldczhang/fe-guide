type Interval = '1m' | '3m' | '5m' | '10m' | '15m' | '1h' | '1d';

type CommonParams = {
  beginDate: Date;
  endDate: Date;
  appName?: string;
  categoryId?: string;
};


type SqlCommonParam = {
  select?: Array<string | ICalcCollection>;
  where?: ICO;
  groupby?: Array<string | ICalcCollection>;
  orderby?: string[][];
  offset?: number;
  limit?: number;
};
