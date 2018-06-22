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
exports.default = {
    state: {
        nummmm: 0,
    },
    reducers: {
        increment(state, payload) {
            state.nummmm += payload;
            return Object.assign({}, state);
        },
    },
    effects: {
        incrementAsync(payload, rootState) {
            return __awaiter(this, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    setTimeout(() => {
                        this.increment(payload);
                        resolve();
                    }, 2000);
                });
            });
        },
    },
};
//# sourceMappingURL=calculate.js.map