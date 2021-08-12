"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../../config.json");
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    fmUser: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    isSubscribedWeekly: {
        type: mongoose.SchemaTypes.Boolean,
        required: true,
    }
});
module.exports = mongoose.model('User', schema);
{
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        };
        mongoose.connect(`mongodb+srv://discordbot:${config_json_1.PASSWORD}@cluster0.dtz4t.mongodb.net/lastfm?retryWrites=true&w=majority`, dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;
        mongoose.connection.on('connected', () => {
            console.log('bot connected to db');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('bot disconnected db');
        });
        mongoose.connection.on('err', (err) => {
            console.log('bot err db' + err);
        });
    };
}
