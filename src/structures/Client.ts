import { MessageEmbed } from 'discord.js';
import { TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import { PREFIX,  DISCORD_BOT_TOKEN } from '../../config.json';

export default class LastyClient extends CommandoClient {
  public constructor() {
    super({
      commandPrefix: PREFIX,
      disableMentions: 'everyone',
      owner: '720425517295075422'
    });
  }

  init() {
    this.registry
      .registerDefaultTypes()
      .registerTypesIn(path.join(__dirname, '../types'))
      .registerGroups([
        ['lastfm', 'Last.fm'],
        ['util', 'Util'],
        ['bot', 'Bot'],
        ['moderator', 'Moderator']
      ])
      .registerDefaultCommands({
        help: false,
        ping: false,
        prefix: true,
        commandState: false,
        unknownCommand: false,
      })
      .registerCommandsIn({
        filter: /^([^.].*)\.(js|ts)$/,
        dirname: path.join(__dirname, '../commands'),
      });
      

    this.on('ready', () => require('../events/ready')(this));

     


    this.on('messageReactionAdd', async (reaction) => {

      
        if (reaction.emoji.name === '🤡') {

          
          const msg = reaction.message;
          const user = reaction.message.author;
          const url = reaction.message.url;
          const chan = reaction.message.channel;
          const clownboard = msg.guild?.channels.cache.find(channel => channel.id == '855944224071221258');
          
          const fetch = await (clownboard as TextChannel).messages.fetch({ limit: 100 }); 


          const embed = new MessageEmbed()
            .setColor('#c9befb')
            .setAuthor(user.tag, user.displayAvatarURL())
            .setTimestamp()
            .setFooter(`🤡 ${(fetch.size) + 1} | ${reaction.message.id}`)
            .setDescription(reaction.message.content)
            .addField('#' + (chan as TextChannel).name, `[Jump to message](${url})`);
          

          (clownboard as TextChannel).send(embed);



          
        }
        
    });
  

    this.on('message', async (message) => {
      if (message.channel.id == "851159183713501184") {
        message.react("👍").then(r => {
          message.react("👎");

        });
        
      }
    })

    this.login(DISCORD_BOT_TOKEN);
  }
}
