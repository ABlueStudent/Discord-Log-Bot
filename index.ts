import { config } from "./config";
import { Bot } from "./src/discord-bot/Bot";

new Bot(config.token)