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
class WhoKnowsAlbumCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'wkalbum',
            memberName: 'wkalbum',
            aliases: ['wka'],
            group: 'lastfm',
            description: 'Returns the top listeners in the server of an album.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: 'albumName',
                    prompt: 'Enter an album name.',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }
    async run(msg, { albumName }) {
        msg.channel.startTyping();
        const fmUser = Utilities_1.default.userInDatabase(msg.author.id);
        let artistName = '';
        if (!albumName) {
            /**
             * If no albumName is given, it checks to see if the user has both set
             * their Last.fm username with Lasty and has scrobbled a track. If the user
             * has recently scrobbled, we use their recent track to find the albumName.
             */
            if (!fmUser) {
                msg.channel.stopTyping();
                return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_UNDEFINED);
            }
            const { error, artist, album } = await lastfm_1.fetchRecentTrack(fmUser);
            if (error) {
                msg.channel.stopTyping();
                return Utilities_1.default.replyEmbedMessage(msg, null, error, { fmUser });
            }
            albumName = album;
            artistName = artist;
        }
        // If artistName is undefined that means albumName is provided so we check
        // if it's a valid album on Last.fm
        if (artistName === '') {
            const { error, artist, name: album } = await lastfm_1.searchAlbum(albumName);
            if (error) {
                msg.channel.stopTyping();
                return Utilities_1.default.replyEmbedMessage(msg, this.name, error, {
                    albumName: album
                });
            }
            artistName = artist;
            albumName = album;
        }
        const users = db_1.default.get('users').value();
        const scrobblesPerUser = [];
        for await (const { userID, fmUser } of users) {
            const { username: discordUsername } = await this.client.users.fetch(userID);
            const { userplaycount } = await lastfm_1.fetchAlbumInfo(artistName, albumName, fmUser);
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
                wkArg: albumName
            });
        }
        const totalListeners = scrobblesPerUser.length;
        const totalScrobbles = scrobblesPerUser.reduce((sum, user) => sum + user.playcount, 0);
        const averageScrobbles = Math.floor(totalScrobbles / totalListeners).toLocaleString();
        const top10Listeners = scrobblesPerUser
            .sort(Utilities_1.default.sortTotalListeners())
            .slice(0, 10)
            .map(({ discordUsername, fmUser, playcount }, i) => {
            const usersAlbumScrobblesURL = Utilities_1.default.encodeURL(`https://www.last.fm/user/${fmUser}/library/music/${artistName}/${albumName}`);
            if (i === 0) {
                return `👑 [${discordUsername}](${usersAlbumScrobblesURL}) ∙ \`${playcount.toLocaleString()} ▶️\``;
            }
            return `[${discordUsername}](${usersAlbumScrobblesURL}) ∙ \`${playcount.toLocaleString()} ▶️\``;
        });
        const albumURL = Utilities_1.default.encodeURL(`https://www.last.fm/music/${artistName}/${albumName}`);
        const listeningStatistics = `${totalListeners.toLocaleString()} listener${totalListeners === 1 ? '' : 's'} ∙ ${totalScrobbles.toLocaleString()} total plays ∙ ${averageScrobbles} average plays`;
        msg.channel.stopTyping();
        return msg.say(new discord_js_1.MessageEmbed()
            .setTitle(`${albumName} ∙ ${artistName}`)
            .setURL(albumURL)
            .setDescription(top10Listeners)
            .setFooter(listeningStatistics)
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = WhoKnowsAlbumCommand;
