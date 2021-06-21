"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const discord_js_1 = require("discord.js");
const config_json_1 = require("../../../config.json");
class ServerInfoCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            memberName: 'serverinfo',
            group: 'util',
            description: 'Returns basic information about the Discord server',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }
    async run(msg) {
        return msg.embed(new discord_js_1.MessageEmbed()
            .setTitle('Server Information')
            .addField('Server Name', msg.guild.name)
            .addField('Total Members', msg.guild.memberCount)
            .addField('Created On', msg.guild.createdAt)
            .setColor(config_json_1.EMBED_COLOR));
    }
}
exports.default = ServerInfoCommand;
