import express, { Express, Request, Response, NextFunction } from 'express'
import * as http from 'http'
import bodyParser from 'body-parser'

export class Server {
  private readonly _app: Express

  get app(): Express {
    return this._app
  }

  private _server!: http.Server

  get server(): http.Server {
    return this._server
  }

  constructor() {
    this._app = express()

    this._app.set('port', process.env.PORT || 8080)

    this.configureMiddleware()
  }

  public configureMiddleware() {
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({ extended: true }))

    // CORS
    this.app.use(function (req: Request, res: Response, next: NextFunction) {
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.setHeader("Access-Control-Allow-Credentials", "true")
      res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE")
      res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization")
      next()
  })
  }

  public start() {
    this._server = this._app.listen(this._app.get('port'), () => {
      console.log('Server is running on port ' + this._app.get('port'))
    })
  }
}