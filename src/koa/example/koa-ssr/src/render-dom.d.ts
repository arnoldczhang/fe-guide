/// <reference types="node" />
import { IncomingMessage } from "http";
import { Store } from "redux";
declare const getRenderDom: (context: any, req: IncomingMessage, store: Store<any, import("redux").AnyAction>) => string;
export default getRenderDom;
