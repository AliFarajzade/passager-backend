import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './app'

dotenv.config({ path: `${__dirname}/../.env` })

const connectionURL = process.env.DB_CONNECTION_URL?.replace(
    '<password>',
    process.env.DB_CONNECTION_PASSWORD as string
) as string

mongoose
    .connect(connectionURL)
    .then(() => console.log('Connection with db has been established.'))
    .catch(err => console.log(err))

const server = app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`)
})

process.on('unhandledRejection', (err: any) => {
    console.log('🧨️🧨️UNHANDLED PROMISE REGECTION🧨️🧨️:\n')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})
