import Eris from 'eris'
import { Db, MongoClient } from 'mongodb'
import { config } from '../config'

export class dbWaiter {
    private bot: Eris.Client
    private db: any
    constructor() {
        this.bot = Eris(config.token)
        new MongoClient(config.dbURI, {useNewUrlParser: true, useUnifiedTopology: true}).connect().then((client) => {
            this.db = client.db(config.dbName)
            console.log('db connected!')
        })

        this.bot.on('ready', () => { console.log('bot connected!') })
        this.bot.on('messageCreate', (msg) => {
            let data = {
                timestamp: msg.timestamp,
                serverID: msg.guildID,
                channelID: msg.channel.id,
                content: msg.content,
                type: 'messageCreate'
            }
            // console.log(data)
            this.db.collection('history').insertOne(data)
        })
        this.bot.on('messageUpdate', (msg) => {
            let data = {
                timestamp: msg.timestamp,
                serverID: msg.guildID,
                channelID: msg.channel.id,
                content: msg.content,
                type: 'messageUpdate'
            }
            // console.log(data)
            this.db.collection('history').insertOne(data)
        })

        this.bot.connect()
    }
}