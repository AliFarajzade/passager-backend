import dotenv from 'dotenv'
import app from './app'

dotenv.config({ path: `${__dirname}/../.env` })

console.log(process.env)

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`)
})
