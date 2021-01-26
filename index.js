require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const http = require('http')
const cors = require('cors')
const { routes } = require('./src/routes')
const { join } = require('path')

// Подключение к БД
const mongoHost = process.env.MONGO_HOST
const mongoPort = process.env.MONGO_PORT
const mongoDbName = process.env.DB_NAME

mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/${mongoDbName}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
)
.then(
  () => {console.log('MongoDB connected')},
  err => {console.log(`MongoDB error connection: ${err}`);}
)

// Инициализация приложения
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', (_, res) => res.sendFile(join(__dirname + '/index.html')))

routes.forEach(item => {
  app.use(`/api/v1/${item}`, require(`./src/routes/${item}`))
})

// Объявление роутов
const PORT = process.env.PORT
http.createServer({}, app).listen(PORT)
console.log(`Server running at ${PORT}`)
