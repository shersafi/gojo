"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const clown_json_1 = tslib_1.__importDefault(require("../../clown.json"));
const discord_js_commando_1 = require("discord.js-commando");
const path_1 = tslib_1.__importDefault(require("path"));
const config_json_1 = require("../../config.json");
class LastyClient extends discord_js_commando_1.CommandoClient {
    constructor() {
        super({
            commandPrefix: config_json_1.PREFIX,
            disableMentions: 'everyone'
        });
    }
    init() {
        this.registry
            .registerDefaultTypes()
            .registerGroups([
            ['lastfm', 'Last.fm'],
            ['util', 'Util']
        ])
            .registerDefaultCommands({
            help: false,
            ping: false,
            prefix: true,
            commandState: false,
            unknownCommand: false
        })
            .registerCommandsIn(path_1.default.join(__dirname, '../commands'));
        this.on('ready', () => require('../events/ready')(this));
        this.on('messageReactionAdd', async (reaction) => {
            var _a;
            if (reaction.emoji.name === '🤡') {
                const msg = reaction.message;
                const user = reaction.message.author;
                const url = reaction.message.url;
                const chan = reaction.message.channel;
                const clownboard = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find(channel => channel.id == '855944224071221258');
                const count = clown_json_1.default.count + 1;
                const embed = new discord_js_1.MessageEmbed()
                    .setColor('#c9befb')
                    .setAuthor(user.tag, user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter(`🤡 ${count} | ${reaction.message.id}`)
                    .setDescription(reaction.message.content)
                    .addField('#' + chan.name, `[Jump to message](${url})`);
                clownboard.send(embed);
            }
        });
        this.on('message', async (message) => {
            if (message.channel.id == "851159183713501184") {
                message.react("👍").then(r => {
                    message.react("👎");
                });
            }
        });
        this.login(config_json_1.DISCORD_BOT_TOKEN);
    }
}
exports.default = LastyClient;