"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUsersWeeklyScrobbles = exports.fetchArtistInfo = exports.fetchArtistTopTracks = exports.searchAlbum = exports.fetchArtistTopAlbums = exports.fetchUsersTopAlbums = exports.fetchAlbumInfo = exports.fetchUsersTopArtists = exports.fetchUsersTopTracks = exports.fetch10RecentTracks = exports.fetchRecentTrack = exports.fetchTrackScrobbles = exports.searchTrack = exports.fetchUserInfo = exports.isValidToken = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const Utilities_1 = tslib_1.__importDefault(require("../structures/Utilities"));
const config_json_1 = require("../../config.json");
const constants_1 = require("../constants");
/**
 * Verifies that the configured Last.fm API key is valid.
 *
 * @param LASTFM_API_KEY A configured Last.fm API Key.
 *
 * @returns If the LASTFM_API_KEY is valid.
 */
async function isValidToken(LASTFM_API_KEY) {
    const GET_TOKEN = 'auth.getToken';
    const AUTH_QUERY_STRING = `&api_key=${LASTFM_API_KEY}&format=json`;
    const getAuthTokenRequestURL = `${constants_1.LASTFM_API_URL}${GET_TOKEN}${AUTH_QUERY_STRING}`;
    try {
        const { data: token } = await axios_1.default.get(getAuthTokenRequestURL);
        if (token)
            return true;
    }
    catch (err) {
        console.error(err);
    }
    return false;
}
exports.isValidToken = isValidToken;
/**
 * Fetches information about a registered Last.fm user.
 *
 * @param fmUser A registered user on Last.fm.
 *
 * @returns Information about a Last.fm user.
 */
async function fetchUserInfo(fmUser) {
    const USER_INFO = 'user.getInfo';
    const USER_QUERY_STRING = `&user=${fmUser}&api_key=${config_json_1.LASTFM_API_KEY}&format=json`;
    const userRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${USER_INFO}${USER_QUERY_STRING}`);
    try {
        const { data: { user: user } } = await axios_1.default.get(userRequestURL);
        const { playcount: totalScrobbles, name, url: profileURL, country, image, registered: { unixtime: unixRegistration } } = user;
        const lastFMAvatar = image[2]['#text'];
        return {
            totalScrobbles: Number(totalScrobbles).toLocaleString(),
            name,
            profileURL,
            country,
            lastFMAvatar,
            unixRegistration
        };
    }
    catch (err) {
        return {
            error: constants_1.USER_UNREGISTERED
        };
    }
}
exports.fetchUserInfo = fetchUserInfo;
/**
 * Fetches track information.
 *
 * @param trackName Name of a track to search.
 *
 * @returns Information about a searched track.
 */
async function searchTrack(trackName) {
    const SEARCH_TRACKS = 'track.search';
    const TRACK_SEARCH_QUERY_STRING = `&track=${trackName}&api_key=${config_json_1.LASTFM_API_KEY}&limit=10&format=json`;
    const trackSearchReqeustURL = encodeURI(`${constants_1.LASTFM_API_URL}${SEARCH_TRACKS}${TRACK_SEARCH_QUERY_STRING}`);
    try {
        const { data: { results: { trackmatches: { track: tracks } } } } = await axios_1.default.get(trackSearchReqeustURL);
        const { name: track, artist, url: songURL } = tracks[0];
        return {
            track,
            artist,
            songURL
        };
    }
    catch (err) {
        return {
            error: constants_1.TRACK_NOT_FOUND
        };
    }
}
exports.searchTrack = searchTrack;
/**
 * Fetches the playcount and duration of a track for a fmUser.
 *
 * @param trackName Name of a track to search.
 * @param artistName Name of the artist for the track.
 * @param fmUser A registered user on Last.fm.
 *
 * @returns Total scrobbles and duration of a track.
 */
async function fetchTrackScrobbles(trackName, artistName, fmUser) {
    const TRACK_INFO = 'track.getInfo';
    const TRACK_INFO_QUERY_STRING = `&track=${trackName}&artist=${artistName}&user=${fmUser}&api_key=${config_json_1.LASTFM_API_KEY}&autocorrect=1&format=json`;
    const trackInfoRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${TRACK_INFO}${TRACK_INFO_QUERY_STRING}`);
    try {
        const { data: { track } } = await axios_1.default.get(trackInfoRequestURL);
        const { userplaycount, duration } = track;
        return {
            userplaycount,
            duration
        };
    }
    catch (err) {
        return {
            error: constants_1.TRACK_NOT_FOUND
        };
    }
}
exports.fetchTrackScrobbles = fetchTrackScrobbles;
/**
 * Fetches the most recently listened to track for the provided Last.fm user.
 *
 * @param fmUser A registered user on Last.fm.
 *
 * @returns Information on the last scrobbled track for a user.
 */
async function fetchRecentTrack(fmUser) {
    const RECENT_TRACKS = 'user.getRecentTracks';
    const SONG_QUERY_STRING = `&user=${fmUser}&api_key=${config_json_1.LASTFM_API_KEY}&limit=1&format=json`;
    const songRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${RECENT_TRACKS}${SONG_QUERY_STRING}`);
    try {
        const recentRes = await axios_1.default.get(songRequestURL);
        const latestTrack = recentRes.data.recenttracks.track[0];
        if (!latestTrack)
            return { error: constants_1.EMPTY_LISTENING_DATA };
        const { name: track, artist: { '#text': artist }, album: { '#text': album }, url: songURL } = latestTrack;
        const albumCover = latestTrack.image[3]['#text'];
        const { error, userplaycount, duration } = await fetchTrackScrobbles(track, artist, fmUser);
        if (!track && !artist && error) {
            return {
                error: constants_1.TRACK_NOT_FOUND
            };
        }
        const artistURL = Utilities_1.default.encodeURL(`https://www.last.fm/music/${artist}`);
        const trackLength = duration && duration !== '0'
            ? Utilities_1.default.millisToMinutesAndSeconds(Number(duration))
            : undefined;
        return {
            track,
            artist,
            trackLength,
            album,
            albumCover,
            songURL,
            artistURL,
            userplaycount: userplaycount ? Number(userplaycount).toLocaleString() : 0
        };
    }
    catch (err) {
        return {
            error: constants_1.USER_UNREGISTERED
        };
    }
}
exports.fetchRecentTrack = fetchRecentTrack;
/**
 * Fetches 10 most recently listen to tracks for the provided Last.fm user.
 *
 * @param fmUser A registered user on Last.fm.
 *
 * @returns Array of the 10 last scrobbled tracks for a user.
 */
async function fetch10RecentTracks(fmUser) {
    if (!fmUser) {
        return {
            error: constants_1.USER_UNDEFINED_ARGS
        };
    }
    const GET_RECENT_TRACKS = 'user.getRecentTracks';
    const TRACKS_QUERY_STRING = `&user=${fmUser}&api_key=${config_json_1.LASTFM_API_KEY}&limit=10&format=json`;
    const recentTracksRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${GET_RECENT_TRACKS}${TRACKS_QUERY_STRING}`);
    try {
        const { data: { recenttracks: { track: tracks } } } = await axios_1.default.get(recentTracksRequestURL);
        if (tracks.length === 0 || tracks.length < 10) {
            return {
                error: constants_1.EMPTY_LISTENING_DATA
            };
        }
        return {
            tracks
        };
    }
    catch (err) {
        return {
            error: constants_1.USER_UNREGISTERED
        };
    }
}
exports.fetch10RecentTracks = fetch10RecentTracks;
/**
 * Fetches a user's top 10 most scrobbled tracks for the provided time period.
 *
 * @param period A valid period in the PERIOD_PARAMS.
 * @param fmUser A registered user on Last.fm.
 *
 * @returns Array of a user's top scrobbled tracks and a readable period.
 */
async function fetchUsersTopTracks(period, fmUser) {
    if (!fmUser) {
        return {
            error: constants_1.USER_UNDEFINED_ARGS
        };
    }
    if (period && !constants_1.PERIOD_PARAMS[period]) {
        return {
            error: constants_1.PERIOD_INVALID,
            period
        };
    }
    const GET_TOP_TRACKS = 'user.getTopTracks';
    const TOP_TRACKS_QUERY_STRING = `&user=${fmUser}&period=${constants_1.PERIOD_PARAMS[period]}&api_key=${config_json_1.LASTFM_API_KEY}&limit=10&format=json`;
    const topTracksRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${GET_TOP_TRACKS}${TOP_TRACKS_QUERY_STRING}`);
    try {
        const { data: { toptracks: { track: tracks } } } = await axios_1.default.get(topTracksRequestURL);
        if (tracks.length === 0) {
            return {
                error: constants_1.EMPTY_LISTENING_DATA
            };
        }
        return {
            tracks,
            readablePeriod: Utilities_1.default.makeReadablePeriod(period)
        };
    }
    catch (err) {
        return {
            error: constants_1.USER_UNREGISTERED
        };
    }
}
exports.fetchUsersTopTracks = fetchUsersTopTracks;
/**
 * Fetches a user's top 10 most scrobbled artists for the provided time period.
 *
 * @param period A valid period in the PERIOD_PARAMS.
 * @param fmUser A registered user on Last.fm.
 *
 * @returns Array of a user's top scrobbled artists and a readable period.
 */
async function fetchUsersTopArtists(period, fmUser) {
    if (!fmUser) {
        return {
            error: constants_1.USER_UNDEFINED_ARGS
        };
    }
    if (period && !constants_1.PERIOD_PARAMS[period]) {
        return {
            error: constants_1.PERIOD_INVALID,
            period
        };
    }
    const GET_TOP_ARTISTS = 'user.getTopArtists';
    const TOP_ARTISTS_QUERY_STRING = `&user=${fmUser}&period=${constants_1.PERIOD_PARAMS[period]}&api_key=${config_json_1.LASTFM_API_KEY}&limit=10&format=json`;
    const topArtistsRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${GET_TOP_ARTISTS}${TOP_ARTISTS_QUERY_STRING}`);
    try {
        const { data: { topartists: { artist: artists } } } = await axios_1.default.get(topArtistsRequestURL);
        if (artists.length === 0) {
            return {
                error: constants_1.EMPTY_LISTENING_DATA
            };
        }
        return {
            artists,
            readablePeriod: Utilities_1.default.makeReadablePeriod(period)
        };
    }
    catch (err) {
        return {
            error: constants_1.USER_UNREGISTERED
        };
    }
}
exports.fetchUsersTopArtists = fetchUsersTopArtists;
/**
 * Fetches information about an album and returns the url and playcount for an fmUser.
 *
 * @param artistName Name of an artist to search.
 * @param albumName Name of an album to search.
 * @param fmUser A registered user on Last.fm.
 *
 * @returns Information about an album.
 */
async function fetchAlbumInfo(artistName, albumName, fmUser) {
    if (!albumName) {
        return {
            error: constants_1.ALBUM_UNDEFINED
        };
    }
    const ALBUM_GET_INFO = 'album.getInfo';
    const ALBUM_INFO_QUERY_STRING = `&artist=${artistName}&album=${albumName}&api_key=${config_json_1.LASTFM_API_KEY}&limit10&username=${fmUser}&autocorrect=1&format=json`;
    const albumInfoReqeustURL = encodeURI(`${constants_1.LASTFM_API_URL}${ALBUM_GET_INFO}${ALBUM_INFO_QUERY_STRING}`);
    try {
        const { data: { album: { name: formattedArtistName, url: albumURL, userplaycount } } } = await axios_1.default.get(albumInfoReqeustURL);
        return {
            formattedArtistName,
            albumURL,
            userplaycount
        };
    }
    catch (err) {
        return {
            error: constants_1.ALBUM_NOT_FOUND,
            albumName
        };
    }
}
exports.fetchAlbumInfo = fetchAlbumInfo;
/**
 * Fetches a user's top 10 most scrobbled albums for the provided time period.
 *
 * @param period A valid period in the PERIOD_PARAMS.
 * @param fmUser A registered user on Last.fm.
 *
 * @returns Array of a user's top scrobbled artists and a readable period.
 */
async function fetchUsersTopAlbums(period, fmUser) {
    if (!fmUser) {
        return {
            error: constants_1.USER_UNDEFINED_ARGS
        };
    }
    if (period && !constants_1.PERIOD_PARAMS[period]) {
        return {
            error: constants_1.PERIOD_INVALID,
            period
        };
    }
    const GET_TOP_ALBUMS = 'user.getTopAlbums';
    const TOP_ALBUMS_QUERY_STRING = `&user=${fmUser}&period=${constants_1.PERIOD_PARAMS[period]}&api_key=${config_json_1.LASTFM_API_KEY}&limit=10&format=json`;
    const topAlbumsRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${GET_TOP_ALBUMS}${TOP_ALBUMS_QUERY_STRING}`);
    try {
        const { data: { topalbums: { album: albums } } } = await axios_1.default.get(topAlbumsRequestURL);
        if (albums.length === 0) {
            return {
                error: constants_1.EMPTY_LISTENING_DATA
            };
        }
        return {
            albums,
            readablePeriod: Utilities_1.default.makeReadablePeriod(period)
        };
    }
    catch (err) {
        return {
            error: constants_1.USER_UNREGISTERED
        };
    }
}
exports.fetchUsersTopAlbums = fetchUsersTopAlbums;
/**
 * Fetches the top 10 albums of an artist sorted by listeners.
 *
 * @param artistName Name of an artist to search.
 *
 * @returns Array of the top albums from an artist.
 */
async function fetchArtistTopAlbums(artistName) {
    if (!artistName) {
        return {
            error: constants_1.ARTIST_UNDEFINED
        };
    }
    const ARTIST_GET_TOP_ALBUMS = 'artist.getTopAlbums';
    const TOP_ALBUMS_QUERY_STRING = `&artist=${artistName}&api_key=${config_json_1.LASTFM_API_KEY}&limit=11&autocorrect=1&format=json`;
    const artistTopAlbumsRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${ARTIST_GET_TOP_ALBUMS}${TOP_ALBUMS_QUERY_STRING}`);
    try {
        const { data: { topalbums: { album: albums } } } = await axios_1.default.get(artistTopAlbumsRequestURL);
        if (!albums || albums.length === 0) {
            return { error: constants_1.ARTIST_INVALID, artist: artistName };
        }
        return {
            albums
        };
    }
    catch (err) {
        return {
            error: constants_1.ARTIST_INVALID,
            artist: artistName
        };
    }
}
exports.fetchArtistTopAlbums = fetchArtistTopAlbums;
/**
 * Fetches album information and the album cover image.
 *
 * @param albumName Name of an album to search.
 *
 * @returns Information about a searched album.
 */
async function searchAlbum(albumName) {
    if (!albumName) {
        return {
            error: constants_1.ALBUM_UNDEFINED
        };
    }
    const ALBUM_SEARCH = 'album.search';
    const ALBUM_SEARCH_QUERY_STRING = `&album=${albumName}&api_key=${config_json_1.LASTFM_API_KEY}&autocorrect=1&format=json`;
    const albumSearchRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${ALBUM_SEARCH}${ALBUM_SEARCH_QUERY_STRING}`);
    try {
        const { data: { results: { albummatches: { album: albums } } } } = await axios_1.default.get(albumSearchRequestURL);
        if (albums.length === 0) {
            return {
                error: constants_1.ALBUM_INVALID
            };
        }
        const { name, artist, url: albumURL, image } = albums[0];
        const coverURL = image[3]['#text'];
        return {
            name,
            artist,
            albumURL,
            albumCoverURL: coverURL
        };
    }
    catch (err) {
        return {
            error: constants_1.ALBUM_INVALID
        };
    }
}
exports.searchAlbum = searchAlbum;
/**
 * Fetches the top 10 tracks of an artist sorted by listeners.
 *
 * @param artistName Name of an artist to search.
 *
 * @returns Array of the top tracks from an artist.
 */
async function fetchArtistTopTracks(artistName) {
    if (!artistName) {
        return {
            error: constants_1.ARTIST_UNDEFINED
        };
    }
    const ARTIST_GET_TOP_TRACKS = 'artist.getTopTracks';
    const TOP_TRACKS_QUERY_STRING = `&artist=${artistName}&api_key=${config_json_1.LASTFM_API_KEY}&limit=10&autocorrect=1&format=json`;
    const artistTopTracksRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${ARTIST_GET_TOP_TRACKS}${TOP_TRACKS_QUERY_STRING}`);
    try {
        const { data: { toptracks: { track: tracks } } } = await axios_1.default.get(artistTopTracksRequestURL);
        if (!tracks || tracks.length === 0) {
            return { error: constants_1.ARTIST_INVALID, artist: artistName };
        }
        return {
            tracks
        };
    }
    catch (err) {
        return {
            error: constants_1.ARTIST_INVALID,
            artist: artistName
        };
    }
}
exports.fetchArtistTopTracks = fetchArtistTopTracks;
/**
 * Fetches information and listening data about an artist.
 *
 * @param artistName Name of an artist to search.
 * @param fmUser A registered user on Last.fm.
 *
 * @returns Information about an ariist and a user's scrobbles.
 */
async function fetchArtistInfo(artistName, fmUser) {
    if (!artistName) {
        return {
            error: constants_1.ARTIST_UNDEFINED
        };
    }
    const ARTIST_GET_INFO = 'artist.getInfo';
    const ARTIST_INFO_QUERY_STRING = `&artist=${artistName}&api_key=${config_json_1.LASTFM_API_KEY}&limit=10&username=${fmUser}&autocorrect=1&format=json`;
    const artistInfoRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${ARTIST_GET_INFO}${ARTIST_INFO_QUERY_STRING}`);
    try {
        const { data: { artist: { name: formattedArtistName, url: artistURL, stats: { listeners, playcount, userplaycount }, similar: { artist: similarArtists }, bio: { summary } } } } = await axios_1.default.get(artistInfoRequestURL);
        return {
            formattedArtistName,
            artistURL,
            listeners,
            playcount,
            userplaycount,
            similarArtists,
            summary
        };
    }
    catch (err) {
        return {
            error: constants_1.ARTIST_NOT_FOUND,
            artist: artistName
        };
    }
}
exports.fetchArtistInfo = fetchArtistInfo;
/**
 * Fetches the total amount of scrobbles in a week to be used on the weekly cron.
 *
 * @param fmUser A registered user on Last.fm.
 *
 * @returns Total scrobbles of a user in the past 7 days.
 */
async function fetchUsersWeeklyScrobbles(fmUser) {
    const GET_TOP_TRACKS = 'user.gettoptracks';
    const TOP_TRACKS_QUERY_STRING = `&user=${fmUser}&period=7day&api_key=${config_json_1.LASTFM_API_KEY}&limit=1000&format=json`;
    const topTracksRequestURL = encodeURI(`${constants_1.LASTFM_API_URL}${GET_TOP_TRACKS}${TOP_TRACKS_QUERY_STRING}`);
    const { data: { toptracks: { track: songs } } } = await axios_1.default.get(topTracksRequestURL);
    return songs;
}
exports.fetchUsersWeeklyScrobbles = fetchUsersWeeklyScrobbles;
