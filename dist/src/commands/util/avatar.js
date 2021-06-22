"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const config_json_1 = require("../../../config.json");
const Utilities_1 = require("../../structures/Utilities");
class AvatarCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: ['ava', 'av', 'avi', 'dp'],
            group: 'util',
            memberName: 'avatar',
            description: 'Gets the avatar from a user',
            format: 'MemberID|MemberName(partial or full) [ImageSize]',
            examples: ['avatar saf 2048'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
            args: [
                {
                    key: 'member',
                    prompt: 'What user would you like to get the avatar from?',
                    type: 'member',
                    default: (msg) => msg.member,
                },
                {
                    key: 'size',
                    prompt: 'What size do you want the avatar to be? (Valid sizes: 128, 256, 512, 1024, 2048)',
                    type: 'integer',
                    oneOf: [16, 32, 64, 128, 256, 512, 1024, 2048],
                    default: 2048,
                }
            ],
        });
    }
    async run(msg, { member, size }) {
        const ava = member.user.displayAvatarURL({ size });
        const embed = new discord_js_1.MessageEmbed();
        const ext = this.fetchExt(ava);
        embed
            .setColor(msg.guild ? msg.guild.me.displayHexColor : config_json_1.EMBED_COLOR)
            .setImage(ext.includes('gif') ? `${ava}&f=.gif` : ava)
            .setTitle(member.displayName)
            .setURL(ava)
            .setDescription(`[Avatar URL](${ava})`);
        Utilities_1.deleteCommandMessages(msg, this.client);
        return msg.embed(embed);
    }
    fetchExt(str) {
        return str.substring(str.length - 14, str.length - 8);
    }
}
exports.default = AvatarCommand;
