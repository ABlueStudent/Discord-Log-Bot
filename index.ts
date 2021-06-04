import express, { Application } from 'express';
import { config } from './config';
import { dbWaiter } from './src/dbWaiter';
import path from "path";

class main {
    private app: Application
    constructor() {
        let db = new dbWaiter()
        this.app = express()
        this.app.set('view engine', 'pug')
        this.app.set('views', path.join(__dirname, '../public'))

        this.app.get('/', async (req, res) => {
            const data = await db.getADayHsitory().toArray()
            res.render('index', {data: data})
        }) // 我知道功能是殘廢的，但時間緊迫。

        this.app.get('/Week', async (req, res) => {
            const data = await db.getAWeekHistory().toArray()
            res.render('index', {data: data})
        }) // 我知道功能是殘廢的，但時間緊迫。

        this.app.get('/All', async (req, res) => {
            const data = await db.getAllHistory().toArray()
            res.render('index', {data: data})
        }) // 我知道功能是殘廢的，但時間緊迫。

        this.app.listen(config.port, "0.0.0.0", ()=>{ console.log('http server started.') })
    }
}

new main()