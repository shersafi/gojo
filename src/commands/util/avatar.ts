import { GuildMember, ImageSize, MessageEmbed } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { EMBED_COLOR } from '../../../config.json';
import { deleteCommandMessages } from '../../structures/Utilities';

interface AvatarArgs {
    member: GuildMember;
    size: ImageSize;
  }
  
  export default class AvatarCommand extends Command {
    public constructor(client: CommandoClient) {
      super(client, {
        name: 'avatar',
        aliases: [ 'ava', 'av', 'avi', 'dp' ],
        group: 'util',
        memberName: 'avatar',
        description: 'Gets the avatar from a user',
        format: 'MemberID|MemberName(partial or full) [ImageSize]',
        examples: [ 'avatar saf 2048' ],
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
            default: (msg: CommandoMessage) => msg.member,
          },
          {
            key: 'size',
            prompt: 'What size do you want the avatar to be? (Valid sizes: 128, 256, 512, 1024, 2048)',
            type: 'integer',
            oneOf: [ '16', '32', '64', '128', '256', '512', '1024', '2048' ],
            default: 2048,
          }
        ],
      });
    }
  
    public async run(msg: CommandoMessage, { member, size }: AvatarArgs) {  
      const ava = member.user.displayAvatarURL({ size });
      const embed = new MessageEmbed();
      const ext = this.fetchExt(ava);
  
      embed
        .setColor(msg.guild ? msg.guild.me!.displayHexColor : EMBED_COLOR)
        .setImage(ext.includes('gif') ? `${ava}&f=.gif` : ava)
        .setTitle(member.displayName)
        .setURL(ava)
        .setDescription(`[Avatar URL](${ava})`);
  
      deleteCommandMessages(msg, this.client);
  
      return msg.embed(embed);
    }
  
    private fetchExt(str: string) {
      return str.substring(str.length - 14, str.length - 8);
    }
  }