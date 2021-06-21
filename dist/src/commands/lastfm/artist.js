"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const lastfm_1 = require("../../api/lastfm");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
const config_json_1 = require("../../../config.json");
class ArtistCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'artist',
            memberName: 'artist',
            group: 'lastfm',
            description: 'Returns listening data, a biography and similar artists of any given artist.',
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
        const fmUser = Utilities_1.default.userInDatabase(msg.author.id);
        const { error, artist, formattedArtistName, artistURL, listeners, playcount, userplaycount, similarArtists, summary } = await lastfm_1.fetchArtistInfo(artistName, fmUser);
        if (error) {
            msg.channel.stopTyping();
            return Utilities_1.default.replyEmbedMessage(msg, null, error, { artist });
        }
        const totalListeners = `\`${Number(listeners).toLocaleString()}\``;
        const totalPlays = `\`${Number(playcount).toLocaleString()}\``;
        const userPlays = fmUser
            ? `\`${Number(userplaycount).toLocaleString()}\``
            : '`0`';
        const strippedSummary = summary.replace(`<a href="${artistURL}">Read more on Last.fm</a>`, '');
        /**
         * Some artists don't have a full biography available. After removing the <a> tag that's
         * on every response a check is done to make sure it still contains content.
         */
        const biography = strippedSummary.length > 1 ? strippedSummary : 'Not Available';
        let similarArtistsString;
        if (similarArtists.length > 0) {
            similarArtistsString = similarArtists === null || similarArtists === void 0 ? void 0 : similarArtists.reduce((str, { name, url }, i) => {
                if (i === similarArtists.length - 1) {
                    return str + `[${name}](${url})`;
                }
                return str + `[${name}](${url}) ∙ `;
            }, '');
        }
        else {
            similarArtistsString = 'Not Available';
        }
        msg.channel.stopTyping();
        return msg.say(new discord_js_1.MessageEmbed()
            .setAuthor(formattedArtistName, undefined, artistURL)
            .addField('Listeners', totalListeners, true)
            .addField('Total Plays', totalPlays, true)
            .addField('Your plays', userPlays, true)
            .addField('Summary', biography)
            .addField('Similar Artists', similarArtistsString)
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = ArtistCommand;
