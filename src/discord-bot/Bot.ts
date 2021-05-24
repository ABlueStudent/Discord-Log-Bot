import Eris from "eris";

export class Bot {
    private token: string

    constructor(token: string) {
        this.token = token;
        let bot = Eris(this.token)

        bot.on("messageCreate", (res) => {})
        bot.on("messageUpdate", (res) => {})

        bot.connect()
    }
}