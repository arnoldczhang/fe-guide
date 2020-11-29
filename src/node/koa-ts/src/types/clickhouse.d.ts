declare module '@apla/clickhouse' {
  interface Options {
    host: string;
    user: string;
    password: string;
    path: string;
    port: number;
    protocol: 'http:' | 'https:';
    dataObjects: boolean;
    format?: string;
    readonly: boolean;
    queryOptions?: {
      profile?: string;
      database?: string;
      // 0 — All queries are allowed.
      // 1 — Only read data queries are allowed.
      // 2 — Read data and change settings queries are allowed.
      readonly?: 0 | 1 | 2;
    };
    timeout?: number;
  }

  class ClickHouse {
    constructor(options: Options);
    querying(query: string): Promise<any>;
  }
  export = ClickHouse;
}
