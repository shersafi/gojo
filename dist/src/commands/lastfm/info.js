"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const lastfm_1 = require("../../api/lastfm");
const constants_1 = require("../../constants");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
const config_json_1 = require("../../../config.json");
class InfoCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'info',
            memberName: 'info',
            group: 'lastfm',
            description: 'Returns information about a Last.fm profile.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: 'fmUser',
                    prompt: 'Enter a registered Last.fm username.',
                    type: 'string',
                    default: (msg) => Utilities_1.default.userInDatabase(msg.author.id)
                }
            ]
        });
    }
    async run(msg, { fmUser }) {
        msg.channel.startTyping();
        if (!fmUser) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, this.name, constants_1.USER_UNDEFINED_ARGS);
        }
        const { error, totalScrobbles, name, profileURL, country, lastFMAvatar, unixRegistration } = await lastfm_1.fetchUserInfo(fmUser);
        if (error) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, null, error, { fmUser });
        }
        msg.channel.stopTyping();
        return msg.say(new discord_js_1.MessageEmbed()
            .setAuthor(name, lastFMAvatar, profileURL)
            .setThumbnail(lastFMAvatar)
            .addField('Total Scrobbes', totalScrobbles)
            .addField('Country', country)
            .addField('Registration Date', new Date(Number(unixRegistration) * 1000).toLocaleString())
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = InfoCommand;
