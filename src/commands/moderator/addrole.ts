import { logModMessage, shouldHavePermission } from '../../structures/Utilities';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { GuildMember, MessageEmbed, Role, TextChannel } from 'discord.js';
import { oneLine, stripIndents } from 'common-tags';
import moment from 'moment';

interface AddRoleArgs {
  member: GuildMember;
  role: Role;
}

export default class AddRoleCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'addrole',
      aliases: [ 'newrole', 'ar' ],
      group: 'moderator',
      memberName: 'addrole',
      description: 'Adds a role to a member',
      format: 'MemberID|MemberName(partial or full) RoleID|RoleName(partial or full)',
      examples: [ 'addrole saf tagrole1' ],
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

  @shouldHavePermission('MANAGE_MESSAGES', true)
  public async run(msg: CommandoMessage, { member, role }: AddRoleArgs) {
    try {
      if (!member.manageable) {
        return msg.reply(oneLine`
          looks like I do not have permission to edit the roles of ${member.displayName}.
          Better go and fix your server's role permissions if you want to use this command!`);
      }

    //   const modlogChannel = msg.guild.settings.get('modlogchannel', null);
      const roleAddEmbed = new MessageEmbed();

      await member.roles.add(role);

      roleAddEmbed
        .setColor('#AAEFE6')
        .setAuthor(msg.author!.tag, msg.author!.displayAvatarURL())
        .setDescription(stripIndents`**Action:** Added ${role.name} to ${member.displayName}`)
        .setTimestamp();

    //   if (msg.guild.settings.get('modlogs', true)) {
    //     logModMessage(
    //       msg, msg.guild, modlogChannel, msg.guild.channels.cache.get(modlogChannel) as TextChannel, roleAddEmbed
    //     );
    //   }


      return msg.embed(roleAddEmbed);
    } catch (err) {
      if (/(?:Missing Permissions)/i.test(err.toString())) {
        return msg.reply(stripIndents`
          an error occurred adding the role \`${role.name}\` to \`${member.displayName}\`.
          The server staff should check that I have \`Manage Roles\` permission and I have the proper hierarchy.`);
      }
      const channel = this.client.channels.cache.get('857390754380775435') as TextChannel;

      channel.send(stripIndents`
        <@${this.client.owners[0].id}> Error occurred in \`addrole\` command!
        **Server:** ${msg.guild.name} (${msg.guild.id})
        **Author:** ${msg.author!.tag} (${msg.author!.id})
        **Time:** ${moment(msg.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}
        **Input:** \`${role.name} (${role.id})\` || \`${member.user.tag} (${member.id})\`
        **Error Message:** ${err}`);

      return msg.reply(oneLine`
        an unknown and unhandled error occurred but I notified ${this.client.owners[0].username}.
        `);
    }
  }
}