import {Request, Response} from 'express'
import { Get, Post } from './src/decorators'
import { Server } from './src/server'
import { dataSource } from './src/Adapters/datenbankAdapter'
import { RezeptFactory } from './src/Adapters/rezeptFactory'
import { RezeptBodyJSON } from 'kern-util'
import { getAllRezepte, getRezept, postRezept } from './src/Adapters/rezeptEndpoints'


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
    async postRezept(req: Request<{}, {}, RezeptBodyJSON>) {
        return await postRezept(req)
    }

    @Get('/rezepte')
    async getAllRezepte() {
        return await getAllRezepte()
    }

    @Get('/rezept/:id')
    async getRezept(req: Request) {
        return await getRezept(req)
    }
}

server.start()
