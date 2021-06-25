import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { stripIndents } from 'common-tags';

export default class CheckGuildsCommand extends Command {
    public constructor(client: CommandoClient) {
      super(client, {
        name: 'checkguilds',
        group: 'bot',
        memberName: 'checkguilds',
        description: 'Check the current guild count and their names',
        guildOnly: false,
        ownerOnly: true,
        guarded: true,
        hidden: true,
      });
    }
  
    async run(msg: CommandoMessage) {
      const guildList = this.client.guilds.cache.map(m => `${m.name} (${m.id})`);
  
      return msg.say(stripIndents`
      \`\`\`
        The current guild count: ${this.client.guilds.cache.size}
        Guild list:
        ${guildList.join('\n')}
      \`\`\`
      `, { split: true });
    }
  }