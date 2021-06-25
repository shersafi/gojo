import { DURA_FORMAT } from '../../constants/index';
import { shouldHavePermission } from '../../structures/Utilities';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { GuildMember, Message, MessageEmbed, TextChannel } from 'discord.js';
import { oneLine, stripIndents } from 'common-tags';
import moment from 'moment';

interface MuteArgs {
  member: GuildMember;
  duration: number;
  logs: boolean;
}

export default class MuteCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'mute',
      aliases: [ 'silent' ],
      group: 'moderator',
      memberName: 'mute',
      description: 'Mute a member',
      format: 'MemberID|MemberName(partial or full) [DurationForMute]',
      details: stripIndents`Requires either a role named \`muted\` on the server, or first having set the mute role with confmute
                You can optionally specify a duration for how long this mute will last. Not specifying any will mean it will last until manually unmuted.
                The format for duration is in minutes, hours or days in the format of \`5m\`, \`2h\` or \`1d\``,
      examples: [ 'mute Muffin 2h' ],
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

  @shouldHavePermission('MANAGE_ROLES', true)
  public async run(msg: CommandoMessage, { member, duration, logs }: MuteArgs) {
    if (member.manageable) {
      try {
        // const modlogChannel = msg.guild.settings.get('modlogchannel', null);
        // const muteRole = msg.guild.settings.get('muterole',
        //   msg.guild.roles.cache.find(r => r.name === 'muted') ? msg.guild.roles.cache.find(r => r.name === 'muted') : null);
        // const muteRole = msg.guild.roles.cache.find(r => r.name === "muted");
        const mutedRole = msg.guild.roles.cache.get('857395974070468610');

        if (!mutedRole) {
          return msg.channel.send('no muted role lmao');
        }

        const muteEmbed = new MessageEmbed();

        await member.roles.add(mutedRole);

        muteEmbed
          .setColor('#AAEFE6')
          .setAuthor(msg.author!.tag, msg.author!.displayAvatarURL())
          .setDescription(stripIndents`
                        **Action:** Muted <@${member.id}>
                        `)
          .setTimestamp();

        // if (msg.guild.settings.get('modlogs', true)) {
        //   logModMessage(
        //     msg, msg.guild, modlogChannel, msg.guild.channels.get(modlogChannel) as TextChannel, muteEmbed
        //   );
        //   logs = true;
        // }

        // deleteCommandMessages(msg, this.client);

        const muteMessage: Message = await msg.embed(muteEmbed) as Message;

        if (duration) {
          setTimeout(async () => {
            await member.roles.remove(mutedRole);
            muteEmbed.setDescription(stripIndents`
                            **Action:** Mute duration ended, unmuted ${member.displayName} (<@${member.id}>)`);
            // if (logs) {
            //   const logChannel: TextChannel = msg.guild.channels.get(modlogChannel) as TextChannel;
            //   logChannel.send('', { embed: muteEmbed });
            // }

            return muteMessage.edit('', muteEmbed);
          }, duration);
        }

        return muteMessage;
      } catch (err) {
        // deleteCommandMessages(msg, this.client);
        if (/(?:Missing Permissions)/i.test(err.toString())) {
          return msg.reply(stripIndents`an error occurred muting \`${member.displayName}\`.
                        Do I have \`Manage Roles\` permission and am I higher in hierarchy than the target's roles?`);
        }
        const channel = this.client.channels.cache.get('857390754380775435') as TextChannel;

        channel.send(stripIndents`
          <@${this.client.owners[0].id}> Error occurred in \`mute\` command!
          **Server:** ${msg.guild.name} (${msg.guild.id})
          **Author:** ${msg.author!.tag} (${msg.author!.id})
          **Time:** ${moment(msg.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}
          **Member:** \`${member.user.username} (${member.id})\`
          **Error Message:** ${err}`);

        return msg.reply(oneLine`
          an unknown and unhandled error occurred but I notified ${this.client.owners[0].username}.
          Want to know more about the error?
          Join the support server by getting an invite by using the \`${msg.guild.commandPrefix}invite\` command`);
      }
    }
    // deleteCommandMessages(msg, this.client);

    return msg.reply(stripIndents`
      an error occurred muting \`${member.displayName}\`.
      Do I have \`Manage Roles\` permission and am I higher in hierarchy than the target's roles?`);
  }
}