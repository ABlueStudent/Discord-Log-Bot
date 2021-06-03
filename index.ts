import express, { Application } from 'express';
import { config } from './config';
import { dbWaiter } from './src/dbWaiter';

class main {
    private app: Application
    constructor() {
        let db = new dbWaiter()
        this.app = express()
        this.app.get('/', async (req, res) => {
            res.send(await db.getAllHistory().toArray())
        }) // 我知道功能是殘廢的，但時間緊迫。

        this.app.listen(config.port, "0.0.0.0", ()=>{ console.log('Idoit sandwitch') })
    }
}

new main()