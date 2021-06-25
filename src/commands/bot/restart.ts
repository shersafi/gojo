import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { DISCORD_BOT_TOKEN } from '../../../config.json';



export default class RestartBot extends Command {
    public constructor(client: CommandoClient) {
      super(client, {
        name: 'restart',
        group: 'bot',
        memberName: 'restart',
        aliases: ['reboot', 'kill'],
        description: 'restart dat shit',
        guildOnly: false,
        ownerOnly: true,
        guarded: true,
        hidden: true,
      });
    }
  
    async run(msg: CommandoMessage) {
      msg.channel.send("Restarting");
      this.client.destroy();
      this.client.login(DISCORD_BOT_TOKEN);  
  
      return msg.say('Successful');

    }
  }