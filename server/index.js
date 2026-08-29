import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { clerkMiddleware, getAuth, requireAuth } from '@clerk/express'

const port = Number(process.env.PORT ?? 3001)
const clientOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

if (!process.env.CLERK_SECRET_KEY) {
  console.error('Missing CLERK_SECRET_KEY. Copy .env.example to .env and add your Clerk keys.')
  process.exit(1)
}

const app = express()

app.disable('x-powered-by')
app.use(cors({ origin: clientOrigins, credentials: true }))
app.use(express.json({ limit: '32kb' }))
app.use(clerkMiddleware())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/me', requireAuth(), (request, response) => {
  const { sessionId, userId } = getAuth(request)
  response.json({ sessionId, userId })
})

app.use((error, _request, response, _next) => {
  const status = Number.isInteger(error.status) ? error.status : 500
  response.status(status).json({
    error: status === 401 ? 'Unauthorized' : 'Request could not be completed',
  })
})

app.listen(port, () => {
  console.log(`Cloudy API listening on http://localhost:${port}`)
})