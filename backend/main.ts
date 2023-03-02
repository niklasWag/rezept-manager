import {Request, Response} from 'express'
import { Get, Post } from './src/decorators'
import { Server } from './src/server'
import { dataSource } from './src/Adapters/datenbankAdapter'
import { RezeptFactory } from './src/Adapters/rezeptFactory'
import { Menge, Rezept, RezeptBodyJSON, RezeptZutat, Zutat } from 'kern-util'
import { arraysEqual } from './src/helpers'


const rezeptFactory = RezeptFactory.getInstance()

const server = new Server()

dataSource.initialize()
    .then(() => console.log('Database connection established'))
    .catch((err) => console.log('Error while establishing database connection', err))

export function getServer() {
    return server
}

class Routes {
    @Get('/')
    get() {
        return `Express is running on port ${server.app.get('port')}`
    }

    @Get('/test')
    getTest() {
        return 'Test'
    }

    @Post('/test')
    postTest(req: Request, res: Response) {
        console.log(req.body)
        return req.body
    }

    @Get('/errTest')
    getErrorTest() {
        throw new Error('Testing')
    }

    @Post('/rezept')
    async postRezept(req: Request<{}, {}, RezeptBodyJSON>, res: Response) {
        const expectedKeys: string[] = [ 'id', 'name', 'aufwand', 'rezeptZutaten' ]
        if (!arraysEqual(Object.keys(req.body), expectedKeys)) throw new Error('body type error')

        const rezeptData: RezeptBodyJSON = req.body
        const rezeptZutaten: RezeptZutat[] = []
        rezeptData.rezeptZutaten.forEach(rezeptZutat => {
            const zutat: Zutat = new Zutat(rezeptZutat.zutat.id, rezeptZutat.zutat.name, rezeptZutat.zutat.typ)
            const menge: Menge = new Menge(rezeptZutat.menge.wert, rezeptZutat.menge.einheit)
            rezeptZutaten.push(new RezeptZutat(rezeptZutat.rezeptId, zutat, menge))
        })
        const rezept = new Rezept(rezeptData.id, rezeptData.name, rezeptData.aufwand, rezeptZutaten)

        return await rezeptFactory.createRezept(rezept)
    }
}

server.start()
