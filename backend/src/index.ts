import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import plantsRouter from './routes/plants'
import gardensRouter from './routes/gardens'
import usersRouter from './routes/users'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}))
app.use(express.json())

app.use('/api/plants', plantsRouter)
app.use('/api/gardens', gardensRouter)
app.use('/api/users', usersRouter)

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🌱 PlantaCare API rodando na porta ${PORT}`)
})
