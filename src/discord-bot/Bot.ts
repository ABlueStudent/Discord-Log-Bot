import Eris from "eris";

export class Bot {
    private token: string

    constructor(token: string) {
        this.token = token;
        
        let bot = Eris(this.token)
        bot.on("messageCreate", (msg) => {
            if (msg.content == "!ping") {
                bot.createMessage(msg.channel.id, "Pong!")
            }
            console.log("["+new Date(msg.timestamp).toTimeString()+"]"+msg.author.username+":"+msg.content)
            // console.log(msg)
        })

        bot.on("messageUpdate", (msg) => {
            console.log("["+new Date(msg.timestamp).toTimeString()+"]"+msg.author.username+":"+msg.content)
        })

        bot.connect()
    }
}