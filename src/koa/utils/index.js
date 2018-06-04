"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const response_1 = require("./response");
const controller_1 = require("../controller");
const service_1 = require("../service");
const constant_1 = require("../config/constant");
const FUNC = v => v;
exports.FUNC = FUNC;
const extend = (...args) => Object.assign.apply(null, args);
exports.extend = extend;
const getQuery = (url = '') => {
    const search = url.split('?')[1];
    return querystring.parse(search);
};
exports.getQuery = getQuery;
const abstractApi = function (key, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { body, url, } = ctx.request;
        let query = getQuery(url);
        if (typeof body === 'object') {
            query = body;
        }
        const res = yield controller_1.default[key](query);
        ctx.body = extend({}, response_1.response, res);
    });
};
exports.abstractApi = abstractApi;
const abstractService = function (key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            service_1.default[key](Object.assign({}, data), (resBody) => {
                resolve({
                    code: constant_1.CODE.SUCCESS,
                    data: !Array.isArray(resBody) ? Object.assign({}, resBody) : resBody,
                });
            }, ({ message = '', }) => {
                reject({
                    code: constant_1.CODE.FAIL,
                    message: msg || constant_1.MSG.ACTFAIL,
                });
            });
        });
    });
};
exports.abstractService = abstractService;
