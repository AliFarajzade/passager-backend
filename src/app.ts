import express from 'express'
import morgan from 'morgan'
import toursRouter from './routes/tours.router'
import usersRouter from './routes/users.router'

const app = express()

// Genral middlewares
app.use(express.json())
process.env.NODE_ENV === 'development' && app.use(morgan('dev'))

// Routers middlewares
app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', usersRouter)

export default app
