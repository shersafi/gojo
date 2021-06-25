"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../constants/index");
const Utilities_1 = require("../../structures/Utilities");
const discord_js_commando_1 = require("discord.js-commando");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const moment_1 = tslib_1.__importDefault(require("moment"));
class MuteCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            aliases: ['silent'],
            group: 'moderator',
            memberName: 'mute',
            description: 'Mute a member',
            format: 'MemberID|MemberName(partial or full) [DurationForMute]',
            details: common_tags_1.stripIndents `Requires either a role named \`muted\` on the server, or first having set the mute role with confmute
                You can optionally specify a duration for how long this mute will last. Not specifying any will mean it will last until manually unmuted.
                The format for duration is in minutes, hours or days in the format of \`5m\`, \`2h\` or \`1d\``,
            examples: ['mute Muffin 2h'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
            args: [
                {
                    key: 'member',
                    prompt: 'Which member should I mute?',
                    type: 'member',
                },
                {
                    key: 'duration',
                    prompt: 'For how long should they be muted?',
                    type: 'duration',
                    default: 0,
                }
            ],
        });
    }
    async run(msg, { member, duration, logs }) {
        if (member.manageable) {
            try {
                const modlogChannel = msg.guild.settings.get('modlogchannel', null);
                const muteRole = msg.guild.settings.get('muterole', msg.guild.roles.cache.find(r => r.name === 'muted') ? msg.guild.roles.cache.find(r => r.name === 'muted') : null);
                const muteEmbed = new discord_js_1.MessageEmbed();
                await member.roles.add(muteRole);
                muteEmbed
                    .setColor('#AAEFE6')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
                    .setDescription(common_tags_1.stripIndents `
                        **Action:** Muted <@${member.id}>
                        **Duration:** ${duration ? moment_1.default.duration(duration).format(index_1.DURA_FORMAT.slice(5)) : 'Until manually removed'}`)
                    .setTimestamp();
                // if (msg.guild.settings.get('modlogs', true)) {
                //   logModMessage(
                //     msg, msg.guild, modlogChannel, msg.guild.channels.get(modlogChannel) as TextChannel, muteEmbed
                //   );
                //   logs = true;
                // }
                // deleteCommandMessages(msg, this.client);
                const muteMessage = await msg.embed(muteEmbed);
                if (duration) {
                    setTimeout(async () => {
                        await member.roles.remove(muteRole);
                        muteEmbed.setDescription(common_tags_1.stripIndents `
                            **Action:** Mute duration ended, unmuted ${member.displayName} (<@${member.id}>)`);
                        // if (logs) {
                        //   const logChannel: TextChannel = msg.guild.channels.get(modlogChannel) as TextChannel;
                        //   logChannel.send('', { embed: muteEmbed });
                        // }
                        return muteMessage.edit('', muteEmbed);
                    }, duration);
                }
                return muteMessage;
            }
            catch (err) {
                Utilities_1.deleteCommandMessages(msg, this.client);
                if (/(?:Missing Permissions)/i.test(err.toString())) {
                    return msg.reply(common_tags_1.stripIndents `an error occurred muting \`${member.displayName}\`.
                        Do I have \`Manage Roles\` permission and am I higher in hierarchy than the target's roles?`);
                }
                const channel = this.client.channels.cache.get(process.env.ISSUE_LOG_CHANNEL_ID);
                channel.send(common_tags_1.stripIndents `
          <@${this.client.owners[0].id}> Error occurred in \`mute\` command!
          **Server:** ${msg.guild.name} (${msg.guild.id})
          **Author:** ${msg.author.tag} (${msg.author.id})
          **Time:** ${moment_1.default(msg.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}
          **Member:** \`${member.user.username} (${member.id})\`
          **Duration:** ${duration ? moment_1.default.duration(duration).format(index_1.DURA_FORMAT.slice(5)) : null}
          **Error Message:** ${err}`);
                return msg.reply(common_tags_1.oneLine `
          an unknown and unhandled error occurred but I notified ${this.client.owners[0].username}.
          Want to know more about the error?
          Join the support server by getting an invite by using the \`${msg.guild.commandPrefix}invite\` command`);
            }
        }
        // deleteCommandMessages(msg, this.client);
        return msg.reply(common_tags_1.stripIndents `
      an error occurred muting \`${member.displayName}\`.
      Do I have \`Manage Roles\` permission and am I higher in hierarchy than the target's roles?`);
    }
}
tslib_1.__decorate([
    Utilities_1.shouldHavePermission('MANAGE_ROLES', true),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_js_commando_1.CommandoMessage, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MuteCommand.prototype, "run", null);
exports.default = MuteCommand;
