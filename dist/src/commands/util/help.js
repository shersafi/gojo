"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const discord_js_1 = require("discord.js");
const config_json_1 = require("../../../config.json");
class HelpCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'help',
            memberName: 'help',
            group: 'util',
            description: 'Returns a list of available commands',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }
    async run(msg) {
        return msg.embed(new discord_js_1.MessageEmbed()
            .setTitle('Lasty Commands')
            .addFields([
            {
                name: 'Command Prefix',
                value: `Run commands with prefix \`${config_json_1.PREFIX}\``
            },
            {
                name: '\u200b',
                value: '\u200b'
            },
            {
                name: '`set`',
                value: 'Sets Last.fm username'
            },
            {
                name: '`delete`',
                value: 'Deletes saved Last.fm username'
            },
            {
                name: '`sub`',
                value: 'Subscribe to the Weekly Recap'
            },
            {
                name: '`unsub`',
                value: 'Unsubscribe to the Weekly Recap'
            },
            {
                name: '`info`',
                value: 'Shows Last.FM account information'
            },
            {
                name: '`np`',
                value: 'Shows currently playing song'
            },
            {
                name: '`recent`',
                value: 'Shows 10 most recent tracks played'
            },
            {
                name: '`tracks`',
                value: 'Shows your most played tracks'
            },
            {
                name: '`artists`',
                value: 'Shows your most listened artists'
            },
            {
                name: '`albums`',
                value: 'Shows your most played albums'
            },
            {
                name: '`wk`',
                value: 'Ranks the top listeners of an artist on the server'
            },
            {
                name: '`wka`',
                value: 'Ranks the top listeners of an album on the server'
            },
            {
                name: '`wkt`',
                value: 'Ranks the top listeners of an track on the server'
            },
            {
                name: '`cover`',
                value: 'Shows the album cover of your last listened track or of a searched album'
            },
            {
                name: '`grid`',
                value: 'Shows a grid image of your most played albums'
            },
            {
                name: '`artist`',
                value: 'Shows information about an artist'
            },
            {
                name: '`topalbums`',
                value: 'Shows the top albums by an artist'
            },
            {
                name: '`toptracks`',
                value: 'Shows the top tracks by an artist'
            },
            {
                name: 'Valid Periods',
                value: '`week`, `month`, `90`, `180`, `year`, `all` (Default: all)'
            },
            {
                name: '\u200b',
                value: '\u200b'
            },
            {
                name: '`serverinfo`',
                value: 'Display information about the server'
            },
            {
                name: '`clear`',
                value: '**Admin** - Clear a number of messages in chat. `,clear 20`'
            }
        ])
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = HelpCommand;
