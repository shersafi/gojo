"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const log = console.log;
module.exports = (client) => {
    var _a;
    log(chalk_1.default `{green.bold [Success]} {green Valid Last.fm API Key}`);
    log(chalk_1.default `{cyan.bold [Discord.js]} {white.bold ${client.user.username}} {cyan.bold is online!}`);
    (_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.setActivity('xd | ,help');
};
