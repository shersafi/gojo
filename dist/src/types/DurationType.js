"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
class DurationType extends discord_js_commando_1.ArgumentType {
    constructor(client) {
        super(client, 'duration');
        this.timeIds = new Set([
            'ms', 'millisecond', 'milliseconds',
            's', 'second', 'seconds',
            'm', 'min', 'mins', 'minute', 'minutes',
            'h', 'hr', 'hrs', 'hour', 'hours',
            'd', 'day', 'days',
            'w', 'week', 'weeks',
            'mo', 'month', 'months',
            'y', 'year', 'years'
        ]);
        this.duration = 0;
    }
    validate(value) {
        const MATCHES_ALL = value.match(/\d+\s*[A-Za-z]+/g);
        if (MATCHES_ALL) {
            for (const match of MATCHES_ALL) {
                const tempNum = match.match(/\d+/g);
                const tempStr = match.match(/[A-Za-z]+/g);
                if (!tempNum || (tempNum.length !== 1))
                    return false;
                if (!tempStr || (tempStr.length !== 1))
                    return false;
                if (!Number.isInteger(parseInt(tempNum[0])))
                    return false;
                if (!this.timeIds.has(tempStr[0]))
                    return false;
            }
            return true;
        }
        return false;
    }
    parse(value) {
        const MATCHES_ALL = value.match(/\d+\s*[A-Za-z]+/g);
        if (MATCHES_ALL) {
            let totalTime = 0;
            MATCHES_ALL.forEach((dur) => {
                const tempNum = parseInt(dur.match(/\d+/g)[0]);
                const tempStr = dur.match(/[A-Za-z]+/g)[0];
                if (isNaN(tempNum)) {
                    totalTime = 0;
                }
                else {
                    totalTime += tempNum * this.determineTimeType(tempStr);
                }
            });
            if (totalTime) {
                this.duration = totalTime;
                return this.duration;
            }
        }
        return null;
    }
    determineTimeType(str) {
        switch (str) {
            case 'ms':
            case 'millisecond':
            case 'milliseconds':
                return 1;
            case 's':
            case 'second':
            case 'seconds':
                return 1000;
            case 'm':
            case 'min':
            case 'mins':
            case 'minute':
            case 'minutes':
                return 60 * 1000;
            case 'h':
            case 'hr':
            case 'hrs':
            case 'hour':
            case 'hours':
                return 60 * 60 * 1000;
            case 'd':
            case 'day':
            case 'days':
                return 24 * 60 * 60 * 1000;
            case 'w':
            case 'week':
            case 'weeks':
                return 7 * 24 * 60 * 60 * 1000;
            case 'mo':
            case 'month':
            case 'months':
                return 30 * 24 * 60 * 60 * 1000;
            case 'y':
            case 'year':
            case 'years':
                return 365 * 24 * 60 * 60 * 1000;
            default:
                return 1;
        }
    }
}
exports.default = DurationType;
