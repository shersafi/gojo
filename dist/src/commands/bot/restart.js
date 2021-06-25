"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const config_json_1 = require("../../../config.json");
class RestartBot extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            group: 'bot',
            memberName: 'restart',
            aliases: ['reboot', 'kill'],
            description: 'restart dat shit',
            guildOnly: false,
            ownerOnly: true,
            guarded: true,
            hidden: true,
        });
    }
    async run(msg) {
        msg.channel.send("Restarting");
        this.client.destroy();
        this.client.login(config_json_1.DISCORD_BOT_TOKEN);
        return msg.say('Successful');
    }
}
exports.default = RestartBot;
