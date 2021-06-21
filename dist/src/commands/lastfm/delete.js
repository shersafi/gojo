"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_commando_1 = require("discord.js-commando");
const db_1 = tslib_1.__importDefault(require("../../db"));
const constants_1 = require("../../constants");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
class DeleteCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'delete',
            aliases: ['reset'],
            memberName: 'delete',
            group: 'lastfm',
            description: 'Deletes your Last.fm username.',
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
            const { userID, fmUser } = existingUser;
            db_1.default.get('users')
                .remove({ userID })
                .write();
            return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_DELETED, {
                fmUser
            });
        }
        return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_UNDEFINED);
    }
}
exports.default = DeleteCommand;
