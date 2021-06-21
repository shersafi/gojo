"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_commando_1 = require("discord.js-commando");
const db_1 = tslib_1.__importDefault(require("../../db"));
const constants_1 = require("../../constants");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
class SubCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'sub',
            memberName: 'sub',
            group: 'lastfm',
            description: 'Subscribes you to the Weekly Recap. A personalized listening report sent to you every week.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }
    async run(msg) {
        const existingUser = Utilities_1.default.findExistingUser(msg.author.id);
        if (existingUser) {
            const { userID, isSubscribedWeekly } = existingUser;
            if (!isSubscribedWeekly) {
                db_1.default.get('users')
                    .find({ userID })
                    .assign({ isSubscribedWeekly: true })
                    .write();
                return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_SUBSCRIBED);
            }
            return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_ALREADY_SUBSCRIBED);
        }
        return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_UNDEFINED);
    }
}
exports.default = SubCommand;
