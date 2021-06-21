"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const lastfm_1 = require("../../api/lastfm");
const constants_1 = require("../../constants");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
const config_json_1 = require("../../../config.json");
class TracksCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'tracks',
            memberName: 'tracks',
            group: 'lastfm',
            description: 'Returns the most listened to tracks for a given time period.',
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
        const { error, tracks, readablePeriod } = await lastfm_1.fetchUsersTopTracks(period, fmUser);
        if (error) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, null, error, {
                period,
                fmUser
            });
        }
        const discordAvatar = msg.author.avatarURL({ dynamic: true });
        const topTracks = tracks === null || tracks === void 0 ? void 0 : tracks.map(track => {
            const { artist: { name: artist, url: artistURL }, name: song, playcount, url } = track;
            return `\`${Number(playcount).toLocaleString()} ▶️\` ∙ **[${song}](${Utilities_1.default.encodeURL(url)})** by [${artist}](${Utilities_1.default.encodeURL(artistURL)})`;
        });
        msg.channel.stopTyping();
        return msg.say(new discord_js_1.MessageEmbed()
            .setAuthor(`Top Tracks ∙ ${readablePeriod} ∙ ${fmUser}`, discordAvatar, `https://www.last.fm/user/${fmUser}`)
            .setDescription(topTracks)
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = TracksCommand;
