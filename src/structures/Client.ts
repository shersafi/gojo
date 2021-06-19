import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import { PREFIX,  DISCORD_BOT_TOKEN } from '../../config.json';

export default class LastyClient extends CommandoClient {
  public constructor() {
    super({
      commandPrefix: PREFIX,
      disableMentions: 'everyone'
    });
  }

  init() {
    this.registry
      .registerDefaultTypes()
      .registerGroups([
        ['lastfm', 'Last.fm'],
        ['util', 'Util']
      ])
      .registerDefaultCommands({
        help: false,
        ping: false,
        prefix: true,
        commandState: false,
        unknownCommand: false
      })
      .registerCommandsIn(path.join(__dirname, '../commands'));

    this.on('ready', () => require('../events/ready')(this));

    this.on('messageReactionAdd', async (reaction, user) => {
      const channel = await this.channels.fetch('842507845014650903');
      if (reaction.emoji.name === '🤡') {
        await channel.send('kys');
      }
    });  

    this.on('message', async (message) => {
      if (message.channel.id == "851159183713501184") {
        message.react("👍");
        message.react("👎");
      }
    })

    this.login(DISCORD_BOT_TOKEN);
  }
}
