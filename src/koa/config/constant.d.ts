declare enum CODE {
    SUCCESS = 0,
    FAIL = 1,
    NOLOGIN = 2,
}
declare const DB: {
    appId: string;
    appKey: string;
};
declare const MSG: {
    ACTFAIL: string;
};
declare function FUNC<T>(value: T): T;
export { CODE, MSG, DB, FUNC };
