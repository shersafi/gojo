"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const constants_1 = require("../../constants");
const lastfm_1 = require("../../api/lastfm");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
const config_json_1 = require("../../../config.json");
const albumNotFoundImage = new discord_js_1.MessageAttachment('assets/images/album_artwork_not_found.png', 'album_artwork_not_found.png');
class CoverCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'cover',
            memberName: 'cover',
            group: 'lastfm',
            description: 'Returns the album cover of any given album.',
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
        if (!albumName && !fmUser) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, this.name, constants_1.USER_UNDEFINED_ALBUM_ARGS);
        }
        if (!albumName && fmUser) {
            // If no albumName is given as an argument, track info is fetched on their most recent track.
            const { error, album, artist, albumCover } = await lastfm_1.fetchRecentTrack(fmUser);
            if (error) {
                msg.channel.stopTyping();
                return Utilities_1.default.replyEmbedMessage(msg, this.name, error, {
                    album
                });
            }
            // The album URL isn't returned from fetchRecentTrack so it's manually created.
            const albumURL = Utilities_1.default.encodeURL(`https://last.fm/music/${artist}/${album}`);
            msg.channel.stopTyping();
            return msg.say(new discord_js_1.MessageEmbed()
                .setImage(albumCover)
                .setDescription(`**${artist}** - **[${album}](${albumURL})**`)
                .setColor(config_json_1.EMBED_COLOR));
        }
        const { error, name, artist, albumURL, albumCoverURL } = await lastfm_1.searchAlbum(albumName);
        if (error) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, this.name, error, {
                albumName
            });
        }
        if (!albumCoverURL) {
            /**
             * If an album that is searched for doesn't have an album cover image
             * an embed is sent with a custom 'Album Artwork Not Found' image.
             */
            msg.channel.stopTyping();
            return msg.say(new discord_js_1.MessageEmbed()
                .attachFiles([albumNotFoundImage])
                .setImage('attachment://album_artwork_not_found.png')
                .setDescription(`**${artist}** - **[${name}](${albumURL})**`)
                .setColor(config_json_1.EMBED_COLOR));
        }
        // If the searched albumName has a cover image we return that in the embed instead.
        msg.channel.stopTyping();
        return msg.say(new discord_js_1.MessageEmbed()
            .setImage(albumCoverURL)
            .setDescription(`**${artist}** - **[${name}](${albumURL})**`)
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = CoverCommand;
