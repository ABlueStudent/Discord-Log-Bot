import { time } from 'console'
import Eris from 'eris'
import { Db, MongoClient } from 'mongodb'
import { config } from '../config'

export class dbWaiter {
    private bot: Eris.Client
    private db?: Db
    constructor() {
        this.bot = Eris(config.token)
        new MongoClient(config.dbURI, {useNewUrlParser: true, useUnifiedTopology: true}).connect().then((client) => {
            this.db = client.db(config.dbName)
            console.log('db connected!')
        })

        this.bot.on('ready', () => { console.log('bot connected!') })
        this.bot.on('messageCreate', (msg) => {
            let urls = Array()
            msg.attachments.forEach(element => {
                urls.push(element.url)
            })
            let data = {
                timestamp: msg.timestamp,
                serverID: msg.guildID,
                channelID: msg.channel.id,
                msgID: msg.id,
                author: msg.author.username,
                content: msg.content+'\n'+urls.join(),
                type: 'messageCreate'
            }
            // console.log(data)
            this.db!.collection('history').insertOne(data)
        })
        this.bot.on('messageUpdate', (msg) => {
            let urls = Array()
            msg.attachments.forEach(element => {
                urls.push(element.url)
            })
            let data = {
                timestamp: msg.timestamp,
                serverID: msg.guildID,
                channelID: msg.channel.id,
                msgID: msg.id,
                author: msg.author.username,
                content: msg.content+'\n'+urls.join(),
                type: 'messageUpdate'
            }
            // console.log(data)
            this.db!.collection('history').insertOne(data)
        })

        this.bot.connect()
    }

    getAllHistory() {
        return this.db!.collection('history').find().sort({timestamp: -1})
    }

    getADayHsitory() {
        const time = new Date().setHours(0, 0, 0, 0)
        return this.db!.collection('history').find({timestamp: {$gt: time}}).sort({timestamp: -1})
    }

    getAWeekHistory() {
        const time = new Date();
        const midnight = time.setHours(0, 0, 0, 0)
        const day = time.getDay() === 0 ? 7 : time.getDay()
        const startTime = (midnight - (day - 1) * 86400)
        return this.db!.collection('history').find({timestamp: {$gt: startTime}}).sort({timestamp: -1})
    }
}