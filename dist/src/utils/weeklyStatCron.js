"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const db_1 = tslib_1.__importDefault(require("../db"));
const getCronData_1 = tslib_1.__importDefault(require("./getCronData"));
const constants_1 = require("../constants");
const config_json_1 = require("../../config.json");
const Utilities_1 = tslib_1.__importDefault(require("../structures/Utilities"));
async function weeklyStatCron(client) {
    const users = db_1.default.get('users').value();
    users.forEach(async (user) => {
        const { userID, fmUser, isSubscribedWeekly } = user;
        if (!isSubscribedWeekly)
            return;
        const { topArtists, topAlbums, topTracks, lastFMAvatar, weeklyScrobbles, error } = await getCronData_1.default(fmUser);
        if (error) {
            return client.users
                .fetch(userID)
                .then(user => user.send(Utilities_1.default.createEmbedMessage(constants_1.ERROR, `Weekly Recap was unsuccessful.\n**${fmUser}** is not a registered Last.fm user or listening data is unavailable.`)));
        }
        const now = dayjs_1.default().format('M/D');
        const lastWeek = dayjs_1.default()
            .subtract(7, 'day')
            .format('M/D');
        client.users
            .fetch(userID)
            .then(user => {
            user.send(new discord_js_1.MessageEmbed()
                .setTitle(`:musical_note: Weekly Recap (${lastWeek} - ${now})`)
                .setAuthor(`Last.fm | ${fmUser}`, lastFMAvatar, `https://last.fm/user/${fmUser}`)
                .setDescription(`Scrobbles • \`${weeklyScrobbles} ▶️\``)
                .setColor(config_json_1.EMBED_COLOR));
            user.send(new discord_js_1.MessageEmbed()
                .setTitle('**:man_singer: Top Artists**')
                .setDescription(topArtists)
                .setColor(config_json_1.EMBED_COLOR));
            user.send(new discord_js_1.MessageEmbed()
                .setTitle('**:cd: Top Albums**')
                .setDescription(topAlbums)
                .setColor(config_json_1.EMBED_COLOR));
            user.send(new discord_js_1.MessageEmbed()
                .setTitle('**:repeat: Top Tracks**')
                .setDescription(topTracks)
                .setColor(config_json_1.EMBED_COLOR));
        })
            .catch(err => {
            console.error(err);
        });
    });
}
exports.default = weeklyStatCron;
