"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldHavePermission = exports.logModMessage = exports.deleteCommandMessages = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const db_1 = tslib_1.__importDefault(require("../db"));
const lastfm_1 = require("../api/lastfm");
const constants_1 = require("../constants");
const config_json_1 = require("../../config.json");
const deleteCommandMessages = (msg, client) => {
    if (msg.deletable && client.provider.get(msg.guild, 'deletecommandmessages', false))
        msg.delete();
};
exports.deleteCommandMessages = deleteCommandMessages;
const logModMessage = async (msg, guild, outChannelID, outChannel, embed) => {
    if (!guild.settings.get('hasSentModLogMessage', false)) {
        msg.reply(oneLine `
            📃 I can keep a log of moderator actions if you create a channel named \'mod-logs\'
            (or some other name configured by the ${guild.commandPrefix}setmodlogs command) and give me access to it.
            This message will only show up this one time and never again after this so if you desire to set up mod logs make sure to do so now.`);
        guild.settings.set('hasSentModLogMessage', true);
    }
    return outChannelID && guild.settings.get('modlogs', false)
        ? outChannel.send('', { embed })
        : null;
};
exports.logModMessage = logModMessage;
const shouldHavePermission = (permission, shouldClientHavePermission = false) => {
    return (target, propertyKey, descriptor) => {
        const fn = descriptor.value;
        descriptor.value = async function value(msg, args, fromPattern) {
            const authorIsOwner = msg.client.isOwner(msg.author);
            const memberHasPermission = msg.member.hasPermission(permission);
            if (!memberHasPermission && !authorIsOwner) {
                return msg.command.onBlock(msg, 'permission', { response: `You need the "${discord_js_commando_1.util.permissions[permission]}" permission to use the ${msg.command.name} command` });
            }
            if (shouldClientHavePermission) {
                const clientHasPermission = msg.channel.permissionsFor(msg.client.user).has(permission);
                if (!clientHasPermission) {
                    return msg.command.onBlock(msg, 'clientPermissions', { missing: [permission] });
                }
            }
            return fn.apply(this, [msg, args, fromPattern]);
        };
        return descriptor;
    };
};
exports.shouldHavePermission = shouldHavePermission;
class Utilities {
    static findExistingUser(userID) {
        return db_1.default
            .get('users')
            .find({ userID })
            .value();
    }
    static userInDatabase(userID) {
        const dbUser = db_1.default
            .get('users')
            .find({ userID })
            .value();
        if (!dbUser) {
            return false;
        }
        return dbUser.fmUser;
    }
    static millisToMinutesAndSeconds(millis) {
        const minutes = Math.floor(millis / 60000);
        const seconds = Number(((millis % 60000) / 1000).toFixed(0));
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    static makeReadablePeriod(period) {
        if (period in constants_1.READABLE_PERIODS)
            return constants_1.READABLE_PERIODS[period];
        return 'Overall';
    }
    static sortTotalListeners() {
        return (a, b) => b.playcount - a.playcount;
    }
    static pluralize(word) {
        if (word.endsWith('s'))
            return `${word}'`;
        return `${word}'s`;
    }
    static encodeURL(url) {
        return encodeURI(url
            .split(' ')
            .join('+')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29'));
    }
    static async validateToken(apiKey) {
        if (!(await lastfm_1.isValidToken(apiKey))) {
            console.log(chalk_1.default `{red.bold [Error] Invalid Last.fm API Key. Visit the link below for a key.\n}
    {white https://www.last.fm/api/account/create​}
    `);
            process.exit(0);
        }
    }
    static validateEmbedColor(hexCode) {
        const regex = /^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$/i;
        if (hexCode && regex.test(hexCode)) {
            return console.log(chalk_1.default `{green.bold [Success]} {green Valid EMBED_COLOR}`);
        }
        console.log(chalk_1.default `{red.bold [Error] Invalid EMBED_COLOR in config.json. Use hex color codes only.}`);
        process.exit(0);
    }
    static createEmbedMessage(status, statusDescription) {
        return new discord_js_1.MessageEmbed()
            .setAuthor(status === constants_1.SUCCESS ? '✅ Success' : '❌ Error')
            .setDescription(statusDescription)
            .setColor(config_json_1.EMBED_COLOR);
    }
    static replyEmbedMessage(msg, commandName, statusDescription, embedData = {}) {
        /**
         * wkArg is ambiguously used as a catch all (album, artist, or track)
         * for not enough listening data for the whoknows commands.
         */
        const { period, fmUser, artist, albumName, wkArg } = embedData || {};
        switch (statusDescription) {
            case constants_1.USER_UNDEFINED_ARGS:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `Last.fm username not set, enter \`,set <lastFMUsername>\` or enter a username after \`${commandName}\``));
            case constants_1.USER_UNDEFINED_ALBUM_ARGS:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `Last.fm username not set, enter \`,set <lastFMUsername>\` or enter an album name after \`${commandName}\``));
            case constants_1.USER_UNDEFINED:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `Last.fm username not set, enter \`,set <lastFMUsername>\``));
            case constants_1.USER_SET:
                return msg.say(this.createEmbedMessage(constants_1.SUCCESS, `Last.fm username set to **${fmUser}**`));
            case constants_1.USER_EXISTS:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `Last.fm username is already set to **${fmUser}**`));
            case constants_1.USER_UPDATED:
                return msg.say(this.createEmbedMessage(constants_1.SUCCESS, `Last.fm username updated to **${fmUser}**`));
            case constants_1.USER_DELETED:
                return msg.say(this.createEmbedMessage(constants_1.SUCCESS, `**${fmUser}** has been deleted from the database`));
            case constants_1.USER_SUBSCRIBED:
                return msg.say(this.createEmbedMessage(constants_1.SUCCESS, 'Subscribed to the Weekly Recap!'));
            case constants_1.USER_UNSUBSCRIBED:
                return msg.say(this.createEmbedMessage(constants_1.SUCCESS, 'Unsubscribed from the Weekly Recap!'));
            case constants_1.USER_ALREADY_SUBSCRIBED:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, 'You are already subscribed to the Weekly Recap!'));
            case constants_1.USER_ALREADY_UNSUBSCRIBED:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, 'You are already unsubscribed to the Weekly Recap!'));
            case constants_1.USER_UNREGISTERED:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `**${fmUser}** is not a registered Last.fm user`));
            case constants_1.ALBUM_UNDEFINED:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `Enter the name of an album after \`${commandName}\``));
            case constants_1.ALBUM_INVALID:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `No album found for **${albumName}**`));
            case constants_1.ARTIST_UNDEFINED:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `Enter the name of an artist after \`${commandName}\``));
            case constants_1.ALBUM_NOT_FOUND:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `No album found named **${albumName}**`));
            case constants_1.ARTIST_INVALID:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `No albums found for **${artist}**`));
            case constants_1.ARTIST_NOT_FOUND:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `No artist found named **${artist}**`));
            case constants_1.PERIOD_INVALID:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `Invalid period: **${period}**\nPeriods:  \`week\`, \`month\`, \`90\`, \`180\`, \`year\`, \`all\` (Default: all)`));
            case constants_1.EMPTY_LISTENING_DATA:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `**${fmUser}** hasn't listened to anything recently...`));
            case constants_1.NOT_ENOUGH_LISTENERS:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `Not enough listeners of **${wkArg}** on this server!`));
            case constants_1.TRACK_NOT_FOUND:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, `Track not found on Last.fm!`));
            case constants_1.EMBED_SIZE_EXCEEDED_RECENT:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, 'Some track titles are too long and exceed the total embed message size of 2048 characters.'));
            case constants_1.PERMISSION_INVALID:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, 'You do not have permission to do that.'));
            default:
                return msg.say(this.createEmbedMessage(constants_1.ERROR, 'Error not recognized.'));
        }
    }
}
exports.default = Utilities;
