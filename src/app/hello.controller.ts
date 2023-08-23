import { RequestHandler } from 'express'

export const sayHelloController: RequestHandler = (req, res) => {
  res.status(200).json({ message: 'Hello world!' })
}
