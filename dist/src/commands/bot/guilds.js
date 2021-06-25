"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const common_tags_1 = require("common-tags");
class CheckGuildsCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'checkguilds',
            group: 'bot',
            memberName: 'checkguilds',
            description: 'Check the current guild count and their names',
            guildOnly: false,
            ownerOnly: true,
            guarded: true,
            hidden: true,
        });
    }
    async run(msg) {
        const guildList = this.client.guilds.cache.map(m => `${m.name} (${m.id})`);
        return msg.say(common_tags_1.stripIndents `
      \`\`\`
        The current guild count: ${this.client.guilds.cache.size}
        Guild list:
        ${guildList.join('\n')}
      \`\`\`
      `, { split: true });
    }
}
exports.default = CheckGuildsCommand;
