import express from 'express'
import cors from 'cors'
import { healthRouter } from './routes/health'
import { convertRouter } from './routes/convert'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/convert', convertRouter)

app.use(errorHandler)

export { app }
