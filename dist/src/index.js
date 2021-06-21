"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Client_1 = tslib_1.__importDefault(require("./structures/Client"));
const cron_1 = require("cron");
const Utilities_1 = tslib_1.__importDefault(require("./structures/Utilities"));
const weeklyStatCron_1 = tslib_1.__importDefault(require("./utils/weeklyStatCron"));
require("./db");
const config_json_1 = require("../config.json");
console.clear();
Utilities_1.default.validateToken(config_json_1.LASTFM_API_KEY);
Utilities_1.default.validateEmbedColor(config_json_1.EMBED_COLOR);
const client = new Client_1.default();
try {
    client.init();
}
catch (e) {
    console.error(e);
}
new cron_1.CronJob('0 12 * * 0', () => {
    weeklyStatCron_1.default(client);
}, null, true, 'America/Chicago');
