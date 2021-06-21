"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const lastfm_1 = require("../../api/lastfm");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
const config_json_1 = require("../../../config.json");
class TopAlbumsCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'topalbums',
            memberName: 'topalbums',
            group: 'lastfm',
            description: 'Returns the top albums of an artist sorted by popularity.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: 'artistName',
                    prompt: 'Enter an artist name.',
                    type: 'string'
                }
            ]
        });
    }
    async run(msg, { artistName }) {
        msg.channel.startTyping();
        const { error, artist, albums } = await lastfm_1.fetchArtistTopAlbums(artistName);
        if (error) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, null, error, { artist });
        }
        const formattedArtist = albums[0].artist.name;
        const artistURL = albums[0].artist.url;
        const artistTopAlbums = albums
            .filter((album) => album.name !== '(null)')
            .sort(Utilities_1.default.sortTotalListeners())
            .map((album) => {
            const { name, playcount, url: albumURL } = album;
            return `\`${Number(playcount).toLocaleString()} ▶️\` ∙ **[${name}](${Utilities_1.default.encodeURL(albumURL)})**`;
        })
            .filter((_, i) => i !== 10);
        msg.channel.stopTyping();
        return msg.say(new discord_js_1.MessageEmbed()
            .setAuthor(`${formattedArtist} ∙ Top 10 Albums`, undefined, artistURL)
            .setDescription(artistTopAlbums)
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = TopAlbumsCommand;
