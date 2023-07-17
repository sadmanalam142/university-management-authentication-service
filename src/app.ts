import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import usersRouter from './app/modules/users/users.router'
const app: Application = express()

app.use(cors())

// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users/', usersRouter.router)

app.get('/', (req: Request, res: Response) => {
  res.send('University Application Running')
})

export default app
