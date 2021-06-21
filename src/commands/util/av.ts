import { Message, MessageEmbed, User } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { EMBED_COLOR } from '../../../config.json';

export default class AvCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
          name: 'avatar',
          aliases: ['dp', 'av', 'picture', 'ava'],
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
            prompt: 'whose av u tryna stalk lmfao',
            type: 'member',
            default: ''
            }]
        });
    }

    async run(message: CommandoMessage, args: Record<string, any>) {
        const member = args.member || message.author;
        if (!member.user.avatar) return message.channel.send('doesnt exist dumbass');
        const avatar = member.user.avatarURL({
            format: member.user.avatar.startsWith('a_') ? 'gif' : 'png',
            size: 2048
        });

        const embed = new MessageEmbed()
            .setAuthor(`${member.user.tag}`, avatar)
            .setColor(member.displayHexColor ? member.displayHexColor : EMBED_COLOR)
            .setDescription(`[Avatar URL](${avatar})`)
            .setImage(avatar)
        return message.channel.send({ embed });
    }

}