"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lastfm_1 = require("../api/lastfm");
const constants_1 = require("../constants");
async function getCronData(fmUser) {
    try {
        const { artists } = await lastfm_1.fetchUsersTopArtists('week', fmUser);
        const topArtists = artists.map(artistRes => {
            const { name: artist, playcount } = artistRes;
            const usersArtistsSrobblesURL = `https://www.last.fm/user/${fmUser}/library/music/${artist
                .split(' ')
                .join('+')}`;
            return `\`${Number(playcount).toLocaleString()} ▶️\` • **[${artist}](${usersArtistsSrobblesURL})**`;
        });
        const { albums } = await lastfm_1.fetchUsersTopAlbums('week', fmUser);
        const topAlbums = albums.map(singleAlbum => {
            const { name: albumName, playcount, url: albumURL, artist: { name: artistName, url: artistURL } } = singleAlbum;
            return `\`${Number(playcount).toLocaleString()} ▶️\` • [${albumName}](${albumURL.replace(')', '\\)')}) by **[${artistName}](${artistURL.replace(')', '\\)')})**`;
        });
        const { tracks } = await lastfm_1.fetchUsersTopTracks('week', fmUser);
        const topTracks = tracks.map(track => {
            const { artist: { name: artist, url: artistURL }, name: song, playcount, url } = track;
            return `\`${Number(playcount).toLocaleString()} ▶️\` • [${song}](${url.replace(')', '\\)')}) by **[${artist}](${artistURL.replace(')', '\\)')})**`;
        });
        const { lastFMAvatar } = await lastfm_1.fetchUserInfo(fmUser);
        const weeklyTracks = await lastfm_1.fetchUsersWeeklyScrobbles(fmUser);
        const weeklyScrobbles = weeklyTracks.reduce((total, track) => {
            return (total += Number(track.playcount));
        }, 0);
        return { topArtists, topAlbums, topTracks, lastFMAvatar, weeklyScrobbles };
    }
    catch (err) {
        return {
            error: constants_1.USER_UNREGISTERED
        };
    }
}
exports.default = getCronData;
