import {Request, Response} from 'express'
import { Delete, Get, Post, Put } from './src/Plugins/decorators'
import { Server } from './src/Plugins/server'
import { dataSource } from './src/Plugins/DatenbankAdapter'
import { RezeptFactory } from './src/Adapters/rezeptFactory'
import { RezeptBodyJSON } from 'kern-util'
import { RezeptEndpoints } from './src/Plugins/Endpunkte/rezeptEndpoints'
import { LebensmittelEndpoints } from './src/Plugins/Endpunkte/lebensmittelEndpoints'
import { DatenbankLebensmittelRepository } from './src/Plugins/datenbankEntities/LebensmittelEntity/DatenbankLebensmittelRepository'
import { DatenbankRezeptRepository } from './src/Plugins/datenbankEntities/RezeptEntity/DatenbankRezeptRepository'
import { DatenbankZutatRepository } from './src/Plugins/datenbankEntities/ZutatEntity/DatenbankZutatRepository'
import { LebensmittelEntity } from './src/Plugins/datenbankEntities/LebensmittelEntity/lebensmittel.entity'
import { RezeptEntity } from './src/Plugins/datenbankEntities/RezeptEntity/rezept.entity'
import { ZutatEntity } from './src/Plugins/datenbankEntities/ZutatEntity/zutat.entity'



const rezeptFactory = RezeptFactory.getInstance()
const lebensmittelEndpoints = new LebensmittelEndpoints(DatenbankLebensmittelRepository.getInstance(dataSource.getRepository(LebensmittelEntity)))
const rezeptEndpoints = new RezeptEndpoints(
    DatenbankRezeptRepository.getInstance(dataSource.getRepository(RezeptEntity)),
    DatenbankLebensmittelRepository.getInstance(dataSource.getRepository(LebensmittelEntity)),
    DatenbankZutatRepository.getInstance(dataSource.getRepository(ZutatEntity))
)

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
        return req.body
    }

    @Get('/errTest')
    getErrorTest() {
        throw new Error('Testing')
    }

    @Post('/rezept')
    async postRezept(req: Request<{}, {}, RezeptBodyJSON>) {
        return await rezeptEndpoints.postRezept(req)
    }

    @Put('/rezept')
    async putRezept(req: Request<{}, {}, RezeptBodyJSON>) {
        return await rezeptEndpoints.putRezept(req)
    }

    @Get('/rezepte')
    async getAllRezepte() {
        return await rezeptEndpoints.getAllRezepte()
    }

    @Get('/rezept/:id')
    async getRezept(req: Request) {
        return await rezeptEndpoints.getRezept(req)
    }

    @Delete('/rezept/:id')
    async deleteRezept(req: Request) {
        return await rezeptEndpoints.deleteRezept(req)
    }

    @Get('/lebensmittel')
    async getLebensmittel() {
        return await lebensmittelEndpoints.getLebensmittel()
    }

    @Post('/rezepte/search')
    async searchRezepte(req: Request) {
        return await rezeptEndpoints.searchRezepte(req)
    }
}

server.start()
