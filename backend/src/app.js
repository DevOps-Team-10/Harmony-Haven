import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const app = express()

app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json())


import userRouter from './routes/user.routes.js'

app.use('/user', userRouter)

export {app}
