"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DURA_FORMAT = exports.PERMISSION_INVALID = exports.EMBED_SIZE_EXCEEDED_RECENT = exports.TRACK_NOT_FOUND = exports.NOT_ENOUGH_LISTENERS = exports.EMPTY_LISTENING_DATA = exports.PERIOD_INVALID = exports.ARTIST_NOT_FOUND = exports.ARTIST_INVALID = exports.ALBUM_NOT_FOUND = exports.ALBUM_INVALID = exports.ALBUM_UNDEFINED = exports.ARTIST_UNDEFINED = exports.USER_UNREGISTERED = exports.USER_ALREADY_UNSUBSCRIBED = exports.USER_ALREADY_SUBSCRIBED = exports.USER_UNSUBSCRIBED = exports.USER_SUBSCRIBED = exports.USER_DELETED = exports.USER_UPDATED = exports.USER_EXISTS = exports.USER_SET = exports.USER_UNDEFINED_ALBUM_ARGS = exports.USER_UNDEFINED_ARGS = exports.USER_UNDEFINED = exports.SUCCESS = exports.ERROR = exports.READABLE_PERIODS = exports.PERIOD_PARAMS = exports.LASTFM_API_URL = void 0;
exports.LASTFM_API_URL = 'http://ws.audioscrobbler.com/2.0/?method=';
exports.PERIOD_PARAMS = {
    week: '7day',
    month: '1month',
    '90': '3month',
    '180': '6month',
    year: '12month',
    all: 'overall'
};
exports.READABLE_PERIODS = {
    week: 'Week',
    month: 'Month',
    '90': '3 Months',
    '180': '6 Months',
    year: 'Year',
    all: 'Overall'
};
exports.ERROR = 'ERROR';
exports.SUCCESS = 'SUCCESS';
exports.USER_UNDEFINED = 'USER_UNDEFINED';
exports.USER_UNDEFINED_ARGS = 'USER_UNDEFINED_ARGS';
exports.USER_UNDEFINED_ALBUM_ARGS = 'USER_UNDEFINED_ALBUM_ARGS';
exports.USER_SET = 'USER_SET';
exports.USER_EXISTS = 'USER_EXISTS';
exports.USER_UPDATED = 'USER_UPDATED';
exports.USER_DELETED = 'USER_DELETED';
exports.USER_SUBSCRIBED = 'USER_SUBSCRIBED';
exports.USER_UNSUBSCRIBED = 'USER_UNSUBSCRIBED';
exports.USER_ALREADY_SUBSCRIBED = 'USER_ALREADY_SUBSCRIBED';
exports.USER_ALREADY_UNSUBSCRIBED = 'USER_ALREADY_UNSUBSCRIBED';
exports.USER_UNREGISTERED = 'USER_UNREGISTERED';
exports.ARTIST_UNDEFINED = 'ARTIST_UNDEFINED';
exports.ALBUM_UNDEFINED = 'ALBUM_UNDEFINED';
exports.ALBUM_INVALID = 'ALBUM_INVALID';
exports.ALBUM_NOT_FOUND = 'ALBUM_NOT_FOUND';
exports.ARTIST_INVALID = 'ARTIST_INVALID';
exports.ARTIST_NOT_FOUND = 'ARTIST_NOT_FOUND';
exports.PERIOD_INVALID = 'PERIOD_INVALID';
exports.EMPTY_LISTENING_DATA = 'EMPTY_LISTENING_DATA';
exports.NOT_ENOUGH_LISTENERS = 'NOT_ENOUGH_LISTENERS';
exports.TRACK_NOT_FOUND = 'TRACK_NOT_FOUND';
exports.EMBED_SIZE_EXCEEDED_RECENT = 'EMBED_SIZE_EXCEEDED_RECENT';
exports.PERMISSION_INVALID = 'PERMISSION_INVALID';
exports.DURA_FORMAT = '[in] Y[ year, ]M[ month, ]D[ day, ]H[ hour and ]m[ minute]';
