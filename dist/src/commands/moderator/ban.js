"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Utilities_1 = require("../../structures/Utilities");
const discord_js_commando_1 = require("discord.js-commando");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
class BanCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: ['b', 'banana'],
            group: 'moderator',
            memberName: 'ban',
            description: 'Bans a member from the server',
            format: 'MemberID|MemberName(partial or full) [ReasonForBanning]',
            examples: ['ban JohnDoe annoying'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
            args: [
                {
                    key: 'member',
                    prompt: 'Which member should I ban?',
                    type: 'member',
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for this banishment?',
                    type: 'string',
                    default: '',
                }
            ],
        });
    }
    async run(msg, { member, reason, keepMessages }) {
        if (member.id === msg.author.id)
            return msg.reply('I don\'t think you want to ban yourself.');
        if (!member.bannable)
            return msg.reply('I cannot ban that member, their role is probably higher than my own!');
        if (/--nodelete/im.test(msg.argString)) {
            keepMessages = true;
            reason =
                reason.substring(0, reason.indexOf('--nodelete')) +
                    reason.substring(reason.indexOf('--nodelete') + '--nodelete'.length + 1);
        }
        member.ban({
            days: keepMessages ? 0 : 1,
            reason: reason !== '' ? reason : 'No reason given by staff',
        });
        const banEmbed = new discord_js_1.MessageEmbed();
        const modlogChannel = msg.guild.settings.get('modlogchannel', null);
        banEmbed
            .setColor('#FF1900')
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
            .setDescription(common_tags_1.stripIndents `
        **Member:** ${member.user.tag} (${member.id})
        **Action:** Ban
        **Reason:** ${reason !== '' ? reason : 'No reason given by staff'}`)
            .setTimestamp();
        if (msg.guild.settings.get('modlogs', true)) {
            Utilities_1.logModMessage(msg, msg.guild, modlogChannel, msg.guild.channels.get(modlogChannel), banEmbed);
        }
        return msg.embed(banEmbed);
    }
}
tslib_1.__decorate([
    Utilities_1.shouldHavePermission('BAN_MEMBERS', true),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_js_commando_1.CommandoMessage, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BanCommand.prototype, "run", null);
exports.default = BanCommand;
