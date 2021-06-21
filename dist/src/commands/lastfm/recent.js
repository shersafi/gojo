"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const lastfm_1 = require("../../api/lastfm");
const constants_1 = require("../../constants");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
const config_json_1 = require("../../../config.json");
class RecentCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'recent',
            memberName: 'recent',
            group: 'lastfm',
            description: 'Returns the 10 most recently listened to tracks.',
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
        const { error, tracks } = await lastfm_1.fetch10RecentTracks(fmUser);
        if (error) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, null, error, { fmUser });
        }
        const discordAvatar = msg.author.avatarURL({ dynamic: true });
        const recentTracks = tracks === null || tracks === void 0 ? void 0 : tracks.map((track, i) => {
            const { artist: { '#text': artist }, name: song, url } = track;
            const artistURL = Utilities_1.default.encodeURL(`https://www.last.fm/user/${fmUser}/library/music/${artist}`);
            return `\`${i + 1}\` **[${song}](${Utilities_1.default.encodeURL(url)})** by [${artist}](${artistURL})`;
        });
        const recentTracksLength = recentTracks === null || recentTracks === void 0 ? void 0 : recentTracks.reduce((length, track) => length + track.length, 0);
        if (recentTracksLength >= 2048) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.EMBED_SIZE_EXCEEDED_RECENT);
        }
        msg.channel.stopTyping();
        return msg.say(new discord_js_1.MessageEmbed()
            .setAuthor(`Latest tracks for ${fmUser}`, discordAvatar, `http://www.last.fm/user/${fmUser}`)
            .setDescription(recentTracks)
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = RecentCommand;
