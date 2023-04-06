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
        if (err.message === 'Invalid parameter') {
          res.status(400).send('Invalid parameter')
        } else if (err.message === 'Not found') {
          res.status(404).send()
        } else {
          res.status(500).json({
            message: 'An error occurred',
            error: err.message,
            stack: err.stack
          })
        }
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
      try {
        const original = await descriptor.value(req, res);

        res.status(200).send(original);
      } catch (err: any) {
        if (err.message === 'body type error') {
          res.status(400).send('Body does not match required type')
        } else {
          res.status(500).json({
            message: 'An error occurred',
            error: err.message,
            stack: err.stack
          })
        }
      }
    }

    server.app.post(path, response);
  }
}

export function Put (path: string): MethodDecorator {
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
        if (err.message === 'body type error') {
          res.status(400).send('Body does not match required type')
        } else {
          res.status(500).json({
            message: 'An error occurred',
            error: err.message,
            stack: err.stack
          })
        }
      }
    }

    server.app.put(path, response);
  }
}

export function Delete (path: string): MethodDecorator {
  const server = getServer()
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const response = async (req: Request, res: Response) => {
      try {
        const original = await descriptor.value(req, res);

        res.status(204).send(original);
      } catch (err: any) {
        if (err.message === 'Entity not found error') {
          res.status(404).send('Entity to be deleted was not found')
        } else {
          res.status(500).json({
            message: 'An error occurred',
            error: err.message,
            stack: err.stack
          })
        }
      }
    }

    server.app.delete(path, response);
  }
}