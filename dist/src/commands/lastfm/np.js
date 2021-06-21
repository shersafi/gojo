"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_commando_1 = require("discord.js-commando");
const discord_js_1 = require("discord.js");
const lastfm_1 = require("../../api/lastfm");
const constants_1 = require("../../constants");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
const config_json_1 = require("../../../config.json");
class NowPlayingCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'np',
            memberName: 'np',
            group: 'lastfm',
            description: 'Returns the most recently listened track.',
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
        const [trackInfo, userInfo] = await Promise.all([lastfm_1.fetchRecentTrack(fmUser), lastfm_1.fetchUserInfo(fmUser)]);
        const { error, track, trackLength, artist, album, albumCover, songURL, artistURL, userplaycount } = trackInfo;
        if (error) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, null, error, { fmUser });
        }
        const { totalScrobbles, lastFMAvatar } = userInfo;
        const isDisplayedInline = track.length < 25 ? true : false;
        const npEmbed = new discord_js_1.MessageEmbed()
            .setAuthor(`Last.fm - ${fmUser}`, lastFMAvatar, `http://www.last.fm/user/${fmUser}`)
            .setThumbnail(albumCover)
            .addField('**Track**', `[${track}](${Utilities_1.default.encodeURL(songURL)})`, isDisplayedInline)
            .addField('**Artist**', `[${artist}](${artistURL})`, isDisplayedInline)
            .setFooter(`Playcount: ${userplaycount} ∙ ${fmUser} Scrobbles: ${totalScrobbles ||
            0} ∙ Album: ${album} ${trackLength ? `∙ Length: ${trackLength}` : ''}`)
            .setColor(config_json_1.EMBED_COLOR);
        msg.channel.stopTyping();
        return msg.say(npEmbed).then(async (msg) => {
            await msg.react('👍');
            await msg.react('👎');
        });
    }
}
exports.default = NowPlayingCommand;
