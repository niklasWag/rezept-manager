import express, {Express, Request, Response} from 'express'

const host = 'localhost'
const port = 8080

const app: Express = express()

app.get('/', (req: Request, res: Response) => {
    res.send(`Express is running in a ${process.env.NODE_ENV} environment`)
})

app.listen(port, host, () => {
    console.log('Server is running')
})