import {Request, Response} from 'express'
import { Get, Post } from './src/decorators'
import { Server } from './src/server'

const server = new Server()

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
}

server.start()
