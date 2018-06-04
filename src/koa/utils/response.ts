export interface Response{
  code: number,
  subcode?: number,
  data: Object | void,
  message?: string,
  errorMessage?: string,
};

export const response: Response = {
  code: 0,
  subcode: 0,
  data: {},
  message: '',
  errorMessage: '',
};
