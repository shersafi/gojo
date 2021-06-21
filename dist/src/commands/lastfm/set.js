"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_commando_1 = require("discord.js-commando");
const db_1 = tslib_1.__importDefault(require("../../db"));
const constants_1 = require("../../constants");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
class SetCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'set',
            memberName: 'set',
            group: 'lastfm',
            description: 'Sets your Last.fm username.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: 'fmUser',
                    prompt: 'Enter a registered Last.fm username to set.',
                    type: 'string'
                }
            ]
        });
    }
    async run(msg, { fmUser }) {
        const existingUser = Utilities_1.default.findExistingUser(msg.author.id);
        if (existingUser) {
            if (existingUser.fmUser.toLowerCase() === fmUser.toLowerCase()) {
                return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_EXISTS, {
                    fmUser
                });
            }
            db_1.default.get('users')
                .find({ userID: msg.author.id })
                .assign({ fmUser })
                .write();
            return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_UPDATED, {
                fmUser
            });
        }
        db_1.default.get('users')
            .push({
            userID: msg.author.id,
            fmUser,
            isSubscribedWeekly: true
        })
            .write();
        return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_SET, { fmUser });
    }
}
exports.default = SetCommand;
