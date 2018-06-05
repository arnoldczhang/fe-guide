"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AV = require("leancloud-storage");
require("leancloud-realtime");
var constant_1 = require("../config/constant");
var appId = constant_1.DB.appId, appKey = constant_1.DB.appKey;
var UserKlass = AV.Object.extend('user');
var LogKlass = AV.Object.extend('log');
AV.init({
    appId: appId,
    appKey: appKey,
});
var trackLog = function (log) {
    var logInst = new LogKlass();
    logInst.save(log);
};
var createUser = function (user, resolve, reject) {
    var userInst = new UserKlass();
    userInst.save(user).then(function () {
        resolve(user);
    }).catch(function (err) {
        trackLog({
            message: 'save user error: ${err.message}',
        });
        reject({ err: err });
    });
};
var getUser = function (data, resolve, reject) {
    var query = new AV.Query('user');
    Object.keys(data || {}).forEach(function (key) {
        query.equalTo(key, data[key]);
    });
    query.find().then(function (res) {
        resolve(res[0]);
    }).catch(function (err) {
        trackLog({
            message: 'get user list error: ${err.message}',
        });
        reject({ err: err });
    });
};
exports.user = {
    trackLog: trackLog,
    createUser: createUser,
    getUser: getUser,
};
