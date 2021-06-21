import { Message, MessageEmbed } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { PREFIX, EMBED_COLOR } from '../../../config.json';

interface user {
    username: string;
  }

export default class AvCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
          name: 'avatar',
          aliases: ['dp', 'av', 'picture', 'ava', ],
          memberName: 'avatar',
          group: 'util',
          description: "Shows an avatar's display picture.",
          examples: ['~avatar <mention>'],
          guildOnly: true,
          throttling: {
            usages: 1,
            duration: 5
          },
          args: [{
            key: 'member',
            prompt: 'whose avatar u tryna stalk lmfao',
            type: 'member',
            default: ''
            }]
        });
    }

    run(message: CommandoMessage, args: any) {
        const member = args.member || message.author;
        if (!member.user.avatar) return message.channel.send('This user does not have an avatar wasteman');
        const avatar = member.user.avatarURL({
            format: member.user.avatar.startsWith('a_') ? 'gif' : 'png',
            size: 2048
        });

        const embed = new MessageEmbed()
            .setAuthor(`${member.user.tag}`, avatar)
            .setColor(member.displayHexColor ? member.displayHexColor : '#D0C7FF')
            .setDescription(`[Avatar URL](${avatar})`)
            .setImage(avatar)
        return message.channel.send({ embed });
    }

}