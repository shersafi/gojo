"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const lastfm_1 = require("../../api/lastfm");
const constants_1 = require("../../constants");
const db_1 = tslib_1.__importDefault(require("../../db"));
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
const config_json_1 = require("../../../config.json");
class WhoKnowsTrackCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'wktrack',
            memberName: 'wktrack',
            aliases: ['wkt'],
            group: 'lastfm',
            description: 'Returns the top listeners in the server of a track.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: 'trackName',
                    prompt: 'Enter a track name.',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }
    async run(msg, { trackName }) {
        msg.channel.startTyping();
        const fmUser = Utilities_1.default.userInDatabase(msg.author.id);
        let artistName = '';
        let trackURL = '';
        if (!trackName) {
            /**
             * If no trackName is given, it checks to see if the user has both set
             * their Last.fm username with Lasty and has scrobbled a track. If the user
             * has recently scrobbled, we use their recent track to find the trackName.
             */
            if (!fmUser) {
                msg.channel.stopTyping();
                return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_UNDEFINED);
            }
            const { error, track, artist, songURL } = await lastfm_1.fetchRecentTrack(fmUser);
            if (error) {
                msg.channel.stopTyping();
                return Utilities_1.default.replyEmbedMessage(msg, null, error, { fmUser });
            }
            trackName = track;
            artistName = artist;
            trackURL = songURL;
        }
        // If artistName is undefined that means trackName is provided so we check
        // if it's a valid track on Last.fm
        if (artistName === '') {
            const { error, track, artist, songURL } = await lastfm_1.searchTrack(trackName);
            if (error) {
                msg.channel.stopTyping();
                return Utilities_1.default.replyEmbedMessage(msg, null, error);
            }
            trackName = track;
            artistName = artist;
            trackURL = songURL;
        }
        const users = db_1.default.get('users').value();
        const scrobblesPerUser = [];
        for await (const { userID, fmUser } of users) {
            const { username: discordUsername } = await this.client.users.fetch(userID);
            const { userplaycount } = await lastfm_1.fetchTrackScrobbles(trackName, artistName, fmUser);
            if (Number(userplaycount) > 0) {
                scrobblesPerUser.push({
                    discordUsername,
                    fmUser,
                    playcount: Number(userplaycount)
                });
            }
        }
        if (scrobblesPerUser.length === 0) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.NOT_ENOUGH_LISTENERS, {
                wkArg: trackName
            });
        }
        const totalListeners = scrobblesPerUser.length;
        const totalScrobbles = scrobblesPerUser.reduce((sum, user) => sum + user.playcount, 0);
        const averageScrobbles = Math.floor(totalScrobbles / totalListeners).toLocaleString();
        const top10Listeners = scrobblesPerUser
            .sort(Utilities_1.default.sortTotalListeners())
            .slice(0, 10)
            .map(({ discordUsername, fmUser, playcount }, i) => {
            const usersTrackScrobblesURL = Utilities_1.default.encodeURL(`https://www.last.fm/user/${fmUser}/library/music/${artistName}/_/${trackName}`);
            if (i === 0) {
                return `👑 [${discordUsername}](${usersTrackScrobblesURL}) ∙ \`${playcount.toLocaleString()} ▶️\``;
            }
            return `[${discordUsername}](${usersTrackScrobblesURL}) ∙ \`${playcount.toLocaleString()} ▶️\``;
        });
        const listeningStatistics = `${totalListeners.toLocaleString()} listener${totalListeners === 1 ? '' : 's'} ∙ ${totalScrobbles.toLocaleString()} total plays ∙ ${averageScrobbles} average plays`;
        msg.channel.stopTyping();
        return msg.say(new discord_js_1.MessageEmbed()
            .setTitle(`${trackName} ∙ ${artistName}`)
            .setURL(trackURL)
            .setDescription(top10Listeners)
            .setFooter(listeningStatistics)
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = WhoKnowsTrackCommand;
