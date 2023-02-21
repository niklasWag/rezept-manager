import { Request, Response } from 'express'
import { getServer } from '../main'


export function Get (path: string): MethodDecorator {
  const server = getServer()
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const response = async (req: Request, res: Response) => {
      try {
        const original = await descriptor.value(req, res);

        res.status(200).send(original);
      } catch (err: any) {
        res.status(500).json({
          message: 'An error occurred',
          error: err.message,
          stack: err.stack
        })
      }
    }

    server.app.get(path, response);
  }
}

export function Post (path: string): MethodDecorator {
  const server = getServer()
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const response = async (req: Request, res: Response) => {
        const original = await descriptor.value(req, res);

        res.status(200).send(original);
    }

    server.app.post(path, response);
  }
}