import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(cors({
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('./public'))



// Routes
import employee from './routes/employee.routes.js'
import timeAttendence from './routes/time_Attendence.routes.js'

app.use('/api', (req, res) => { res.json({ message: "deployed" }) })
app.use('/api/employee', employee)
app.use('/api/timeAtt', timeAttendence)



export { app }
