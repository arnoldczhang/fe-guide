"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var querystring = require("querystring");
var response_1 = require("./response");
var controller_1 = require("../controller");
var service_1 = require("../service");
var constant_1 = require("../config/constant");
exports.FUNC = constant_1.FUNC;
var extend = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return Object.assign.apply(null, args);
};
exports.extend = extend;
var invariant = function (expr, errorMessage) {
    if (!expr) {
        throw new Error(errorMessage || 'error');
    }
    return true;
};
var getQuery = function (url) {
    if (url === void 0) { url = ''; }
    var search = url.split('?')[1];
    return querystring.parse(search);
};
exports.getQuery = getQuery;
function abstractApi(key, ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, body, url, query, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = ctx.request, body = _a.body, url = _a.url;
                    query = getQuery(url);
                    invariant(!!controller_1.default[key], 'controller not found');
                    if (typeof body === 'object' && Object.keys(body).length) {
                        query = body;
                    }
                    return [4, controller_1.default[key](query)];
                case 1:
                    res = _b.sent();
                    ctx.body = extend({}, response_1.response, res);
                    return [2];
            }
        });
    });
}
exports.abstractApi = abstractApi;
;
function abstractService(key, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    invariant(!!service_1.default[key], 'service not found');
                    service_1.default[key](__assign({}, data), function (resBody) {
                        resolve({
                            code: constant_1.CODE.SUCCESS,
                            data: !Array.isArray(resBody) ? __assign({}, resBody) : resBody,
                        });
                    }, function (_a) {
                        var _b = _a.message, message = _b === void 0 ? constant_1.MSG.ACTFAIL : _b;
                        reject({
                            code: constant_1.CODE.FAIL,
                            message: message,
                        });
                    });
                })];
        });
    });
}
exports.abstractService = abstractService;
;
