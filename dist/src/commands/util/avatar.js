"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const config_json_1 = require("../../../config.json");
class AvCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: ['dp', 'av', 'picture', 'ava'],
            memberName: 'avatar',
            group: 'util',
            description: "Shows an avatar's display picture.",
            examples: ['~avatar <mention>'],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [{
                    key: 'member',
                    prompt: 'whose av u tryna stalk lmfao',
                    type: 'member',
                    default: ''
                }]
        });
    }
    async run(msg, args) {
        const member = args.member || msg.author;
        if (!member.user.avatar)
            return msg.channel.send('doesnt exist dumbass');
        const avatar = member.user.avatarURL({
            format: member.user.avatar.startsWith('a_') ? 'gif' : 'png',
            size: 2048
        });
        return msg.embed(new discord_js_1.MessageEmbed()
            .setAuthor(`${member.user.tag}`, avatar)
            .setColor(member.displayHexColor ? member.displayHexColor : config_json_1.EMBED_COLOR)
            .setDescription(`[Avatar URL](${avatar})`)
            .setImage(avatar));
    }
}
exports.default = AvCommand;
