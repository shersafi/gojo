"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = tslib_1.__importStar(require("discord.js"));
const discord_js_commando_1 = require("discord.js-commando");
const axios_1 = tslib_1.__importDefault(require("axios"));
const collage_1 = tslib_1.__importDefault(require("@settlin/collage"));
const constants_1 = require("../../constants");
const Utilities_1 = tslib_1.__importDefault(require("../../structures/Utilities"));
const config_json_1 = require("../../../config.json");
class GridCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'grid',
            memberName: 'grid',
            group: 'lastfm',
            description: 'Returns an album cover grid of a specified size.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [
                {
                    key: 'gridSize',
                    prompt: 'Enter a grid size.',
                    type: 'string',
                    oneOf: ['3x3', '4x4', '5x5'],
                    default: '3x3'
                },
                {
                    key: 'period',
                    prompt: 'Enter a valid period.',
                    type: 'string',
                    oneOf: ['week', 'month', '90', '180', 'year', 'all'],
                    default: 'all'
                }
            ]
        });
    }
    async run(msg, { gridSize, period }) {
        msg.channel.startTyping();
        const fmUser = Utilities_1.default.userInDatabase(msg.author.id);
        if (!fmUser) {
            return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.USER_UNDEFINED);
        }
        const [rows, cols] = gridSize.split('x').map(Number);
        const limit = rows * cols;
        const requestURL = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${fmUser}&period=${constants_1.PERIOD_PARAMS[period]}&api_key=${config_json_1.LASTFM_API_KEY}&limit=${limit}&format=json`;
        const albumGrid = await axios_1.default
            .get(requestURL)
            .then(({ data: { topalbums: { album: albums } } }) => {
            const albumCoverLinks = albums.map((album) => {
                if (!album.image[2]['#text']) {
                    return 'assets/images/album_artwork_not_found.png';
                }
                return album.image[2]['#text'];
            });
            if (albumCoverLinks.length < limit / 2) {
                msg.channel.stopTyping();
                return Utilities_1.default.replyEmbedMessage(msg, null, constants_1.EMPTY_LISTENING_DATA, { fmUser });
            }
            const options = {
                sources: albumCoverLinks,
                width: rows,
                height: cols,
                imageWidth: 174,
                imageHeight: 174,
                backgroundColor: '#36393E'
            };
            return collage_1.default(options).then((canvas) => {
                return new discord_js_1.default.MessageAttachment(canvas.toBuffer(), `${gridSize}-${period}-${fmUser}.png`);
            });
        })
            .catch(err => {
            msg.channel.stopTyping();
            console.error(err);
        });
        const discordAvatar = msg.author.avatarURL({
            dynamic: true
        });
        msg.say(new discord_js_1.MessageEmbed()
            .setAuthor(`${fmUser} • ${gridSize} • ${constants_1.READABLE_PERIODS[period]}`, discordAvatar, `https://www.last.fm/user/${fmUser}`)
            .setColor(config_json_1.EMBED_COLOR));
        msg.channel.stopTyping();
        return msg.say(albumGrid);
    }
}
exports.default = GridCommand;
