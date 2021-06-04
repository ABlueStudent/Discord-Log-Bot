"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbWaiter = void 0;
var eris_1 = __importDefault(require("eris"));
var mongodb_1 = require("mongodb");
var config_1 = require("../config");
var dbWaiter = /** @class */ (function () {
    function dbWaiter() {
        var _this = this;
        this.bot = eris_1.default(config_1.config.token);
        new mongodb_1.MongoClient(config_1.config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }).connect().then(function (client) {
            _this.db = client.db(config_1.config.dbName);
            console.log('db connected!');
        });
        this.bot.on('ready', function () { console.log('bot connected!'); });
        this.bot.on('messageCreate', function (msg) {
            var data = {
                timestamp: msg.timestamp,
                serverID: msg.guildID,
                channelID: msg.channel.id,
                msgID: msg.id,
                author: msg.author.username,
                content: msg.content,
                type: 'messageCreate'
            };
            // console.log(data)
            _this.db.collection('history').insertOne(data);
        });
        this.bot.on('messageUpdate', function (msg) {
            var data = {
                timestamp: msg.timestamp,
                serverID: msg.guildID,
                channelID: msg.channel.id,
                msgID: msg.id,
                author: msg.author.username,
                content: msg.content,
                type: 'messageUpdate'
            };
            // console.log(data)
            _this.db.collection('history').insertOne(data);
        });
        this.bot.connect();
    }
    dbWaiter.prototype.getAllHistory = function () {
        return this.db.collection('history').find().sort({ timestamp: -1 });
    };
    dbWaiter.prototype.getADayHsitory = function () {
        var time = new Date().setHours(0, 0, 0, 0) / 1000;
        return this.db.collection('history').find({ timestamp: { $gt: time } }).sort({ timestamp: -1 });
    };
    dbWaiter.prototype.getAWeekHistory = function () {
        var time = new Date();
        var midnight = time.setHours(0, 0, 0, 0) / 1000;
        var day = time.getDay() === 0 ? 7 : time.getDay();
        var startTime = (midnight - (day - 1) * 86400);
        return this.db.collection('history').find({ timestamp: { $gt: startTime } }).sort({ timestamp: -1 });
    };
    return dbWaiter;
}());
exports.dbWaiter = dbWaiter;
