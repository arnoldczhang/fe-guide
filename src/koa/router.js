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
const Router = require("koa-router");
const utils_1 = require("./utils");
const router = new Router();
function index(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.body = 'hello world';
    });
}
;
function test(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        yield utils_1.abstractApi('getInfo', ctx);
    });
}
;
router
    .get('/', index)
    .get('/test', test);
module.exports = router;
