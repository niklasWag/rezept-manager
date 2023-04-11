import {Request, Response} from 'express'
import { Delete, Get, Post, Put } from './src/decorators'
import { Server } from './src/server'
import { dataSource } from './src/Adapters/datenbankAdapter'
import { RezeptFactory } from './src/Adapters/rezeptFactory'
import { RezeptBodyJSON } from 'kern-util'
import { deleteRezept, getAllRezepte, getRezept, postRezept, putRezept, searchRezepte } from './src/Adapters/rezeptEndpoints'
import { getLebensmittel } from './src/Adapters/lebensmittelEndpoints'


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

    @Put('/rezept')
    async putRezept(req: Request<{}, {}, RezeptBodyJSON>) {
        return await putRezept(req)
    }

    @Get('/rezepte')
    async getAllRezepte() {
        return await getAllRezepte()
    }

    @Get('/rezept/:id')
    async getRezept(req: Request) {
        return await getRezept(req)
    }

    @Delete('/rezept/:id')
    async deleteRezept(req: Request) {
        return await deleteRezept(req)
    }

    @Get('/lebensmittel')
    async getLebensmittel() {
        return await getLebensmittel()
    }

    @Post('/rezepte/search')
    async searchRezepte(req: Request) {
        return await searchRezepte(req)
    }
}

server.start()
