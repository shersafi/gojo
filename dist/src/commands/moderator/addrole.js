"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Utilities_1 = require("../../structures/Utilities");
const discord_js_commando_1 = require("discord.js-commando");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const moment_1 = tslib_1.__importDefault(require("moment"));
class AddRoleCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'addrole',
            aliases: ['newrole', 'ar'],
            group: 'moderator',
            memberName: 'addrole',
            description: 'Adds a role to a member',
            format: 'MemberID|MemberName(partial or full) RoleID|RoleName(partial or full)',
            examples: ['addrole saf tagrole1'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3,
            },
            args: [
                {
                    key: 'member',
                    prompt: 'Which member should I assign a role to?',
                    type: 'member',
                },
                {
                    key: 'role',
                    prompt: 'What role should I add to that member?',
                    type: 'role',
                }
            ],
        });
    }
    async run(msg, { member, role }) {
        try {
            if (!member.manageable) {
                return msg.reply(common_tags_1.oneLine `
          looks like I do not have permission to edit the roles of ${member.displayName}.
          Better go and fix your server's role permissions if you want to use this command!`);
            }
            //   const modlogChannel = msg.guild.settings.get('modlogchannel', null);
            const roleAddEmbed = new discord_js_1.MessageEmbed();
            await member.roles.add(role);
            roleAddEmbed
                .setColor('#AAEFE6')
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
                .setDescription(common_tags_1.stripIndents `**Action:** Added ${role.name} to ${member.displayName}`)
                .setTimestamp();
            //   if (msg.guild.settings.get('modlogs', true)) {
            //     logModMessage(
            //       msg, msg.guild, modlogChannel, msg.guild.channels.cache.get(modlogChannel) as TextChannel, roleAddEmbed
            //     );
            //   }
            return msg.embed(roleAddEmbed);
        }
        catch (err) {
            if (/(?:Missing Permissions)/i.test(err.toString())) {
                return msg.reply(common_tags_1.stripIndents `
          an error occurred adding the role \`${role.name}\` to \`${member.displayName}\`.
          The server staff should check that I have \`Manage Roles\` permission and I have the proper hierarchy.`);
            }
            const channel = this.client.channels.cache.get('857390754380775435');
            channel.send(common_tags_1.stripIndents `
        <@${this.client.owners[0].id}> Error occurred in \`addrole\` command!
        **Server:** ${msg.guild.name} (${msg.guild.id})
        **Author:** ${msg.author.tag} (${msg.author.id})
        **Time:** ${moment_1.default(msg.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}
        **Input:** \`${role.name} (${role.id})\` || \`${member.user.tag} (${member.id})\`
        **Error Message:** ${err}`);
            return msg.reply(common_tags_1.oneLine `
        an unknown and unhandled error occurred but I notified ${this.client.owners[0].username}.
        `);
        }
    }
}
tslib_1.__decorate([
    Utilities_1.shouldHavePermission('MANAGE_MESSAGES', true),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_js_commando_1.CommandoMessage, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AddRoleCommand.prototype, "run", null);
exports.default = AddRoleCommand;
