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
class WhoKnowsArtistCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'whoknows',
            memberName: 'whoknows',
            aliases: ['wk'],
            group: 'lastfm',
            description: 'Returns the top listeners in the server of an artist.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: 'artistName',
                    prompt: 'Enter an artist name.',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }
    async run(msg, { artistName }) {
        msg.channel.startTyping();
        const fmUser = Utilities_1.default.userInDatabase(msg.author.id);
        if (!artistName) {
            /**
             * If no artistName is given, it checks to see if the user has both set
             * their Last.fm username with Lasty and has scrobbled a track. If the user
             * has recently scrobbled, we use their recent track to find the artistName.
             */
            if (!fmUser) {
                msg.channel.stopTyping();
                return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_UNDEFINED);
            }
            const { error, artist } = await lastfm_1.fetchRecentTrack(fmUser);
            if (error) {
                msg.channel.stopTyping();
                return Utilities_1.default.replyEmbedMessage(msg, null, error, { fmUser });
            }
            artistName = artist;
        }
        // Check if artistName is a valid artist on Last.fm
        const { error, formattedArtistName, artistURL: url } = await lastfm_1.fetchArtistInfo(artistName, false);
        if (error) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, this.name, error, {
                artist: artistName
            });
        }
        const users = db_1.default.get('users').value();
        const scrobblesPerUser = [];
        for await (const { userID, fmUser } of users) {
            const { username: discordUsername } = await this.client.users.fetch(userID);
            const { userplaycount } = await lastfm_1.fetchArtistInfo(artistName, fmUser);
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
                wkArg: artistName
            });
        }
        const totalListeners = scrobblesPerUser.length;
        const totalScrobbles = scrobblesPerUser.reduce((sum, user) => sum + user.playcount, 0);
        const averageScrobbles = Math.floor(totalScrobbles / totalListeners).toLocaleString();
        const top10Listeners = scrobblesPerUser
            .sort(Utilities_1.default.sortTotalListeners())
            .slice(0, 10)
            .map(({ discordUsername, fmUser, playcount }, i) => {
            const usersArtistScrobbles = Utilities_1.default.encodeURL(`https://www.last.fm/user/${fmUser}/library/music/${artistName}`);
            if (i === 0) {
                return `👑 [${discordUsername}](${usersArtistScrobbles}) ∙ \`${playcount.toLocaleString()} ▶️\``;
            }
            return `[${discordUsername}](${usersArtistScrobbles}) ∙ \`${playcount.toLocaleString()} ▶️\``;
        });
        const artistURL = Utilities_1.default.encodeURL(url);
        const listeningStatistics = `${totalListeners.toLocaleString()} listener${totalListeners === 1 ? '' : 's'} ∙ ${totalScrobbles.toLocaleString()} total plays ∙ ${averageScrobbles} average plays`;
        msg.channel.stopTyping();
        return msg.say(new discord_js_1.MessageEmbed()
            .setTitle(`${formattedArtistName}`)
            .setURL(artistURL)
            .setDescription(top10Listeners)
            .setFooter(listeningStatistics)
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = WhoKnowsArtistCommand;
