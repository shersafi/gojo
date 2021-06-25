import { logModMessage, shouldHavePermission } from '../../structures/Utilities';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';

interface BanArgs {
  member: GuildMember;
  reason: string;
  keepMessages: boolean;
}

export default class BanCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'ban',
      aliases: [ 'b', 'banana' ],
      group: 'moderator',
      memberName: 'ban',
      description: 'Bans a member from the server',
      format: 'MemberID|MemberName(partial or full) [ReasonForBanning]',
      examples: [ 'ban JohnDoe annoying' ],
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

  @shouldHavePermission('BAN_MEMBERS', true)
  public async run(msg: CommandoMessage, { member, reason, keepMessages }: BanArgs) {
    if (member.id === msg.author!.id) return msg.reply('I don\'t think you want to ban yourself.');
    if (!member.bannable) return msg.reply('I cannot ban that member, their role is probably higher than my own!');

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

    const banEmbed = new MessageEmbed();
    const modlogChannel = msg.guild.settings.get('modlogchannel', null);

    banEmbed
      .setColor('#FF1900')
      .setAuthor(msg.author!.tag, msg.author!.displayAvatarURL())
      .setDescription(stripIndents`
        **Member:** ${member.user.tag} (${member.id})
        **Action:** Ban
        **Reason:** ${reason !== '' ? reason : 'No reason given by staff'}`)
      .setTimestamp();

    if (msg.guild.settings.get('modlogs', true)) {
      logModMessage(
        msg, msg.guild, modlogChannel, msg.guild.channels.get(modlogChannel) as TextChannel, banEmbed
      );
    }

    return msg.embed(banEmbed);
  }
}