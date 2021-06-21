"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const constants_1 = require("../../constants");
const lastfm_1 = require("../../api/lastfm");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
const config_json_1 = require("../../../config.json");
class AlbumsCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'albums',
            memberName: 'albums',
            group: 'lastfm',
            description: 'Returns the most listened to albums for a given time period.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: 'period',
                    prompt: 'Enter a valid period.',
                    type: 'string',
                    oneOf: ['week', 'month', '90', '180', 'year', 'all'],
                    default: 'all'
                },
                {
                    key: 'fmUser',
                    prompt: 'Enter a registered Last.fm username.',
                    type: 'string',
                    default: (msg) => Utilities_1.default.userInDatabase(msg.author.id)
                }
            ]
        });
    }
    async run(msg, { period, fmUser }) {
        msg.channel.startTyping();
        if (!fmUser) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, this.name, constants_1.USER_UNDEFINED_ARGS);
        }
        const { error, albums, readablePeriod } = await lastfm_1.fetchUsersTopAlbums(period, fmUser);
        if (error) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, null, error, {
                period,
                fmUser
            });
        }
        const discordAvatar = msg.author.avatarURL({ dynamic: true });
        const topAlbums = albums === null || albums === void 0 ? void 0 : albums.map(singleAlbum => {
            const { name: albumName, playcount, url: albumURL, artist: { name: artistName, url: artistURL } } = singleAlbum;
            return `\`${Number(playcount).toLocaleString()} ▶️\` ∙ **[${albumName}](${Utilities_1.default.encodeURL(albumURL)})** by [${artistName}](${Utilities_1.default.encodeURL(artistURL)})`;
        });
        msg.channel.stopTyping();
        return msg.say(new discord_js_1.MessageEmbed()
            .setAuthor(`Top Albums ∙ ${readablePeriod} ∙ ${fmUser}`, discordAvatar, `https://www.last.fm/user/${fmUser}`)
            .setDescription(topAlbums)
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = AlbumsCommand;
