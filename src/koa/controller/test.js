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
const utils_1 = require("../utils");
function getInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const o1 = yield utils_1.abstractService('getInfoBef', data);
        const o2 = yield utils_1.abstractService('getInfoAft', data);
        const code = o1.code || o2.code || 0;
        return utils_1.extend({}, {
            data: {
                o1: o1.data || {},
                o2: o2.data || {},
            },
            code,
        });
    });
}
;
exports.default = {
    getInfo,
};
