import dotenv from 'dotenv'
import app from './app'
import mongoose from 'mongoose'

dotenv.config({ path: `${__dirname}/../.env` })

const connectionURL = process.env.DB_CONNECTION_URL?.replace(
    '<password>',
    process.env.DB_CONNECTION_PASSWORD as string
) as string

mongoose
    .connect(connectionURL)
    .then(() => console.log('Connection with db has been established.'))
    .catch(err => console.log(err))

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`)
})
