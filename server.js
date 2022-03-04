import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import {DB_URI} from './config/db.config'
import headers from './utils/headers'
import authRoutes from './routes/auth.routes'
import categoryRoutes from './routes/category.routes'
import articleRoutes from './routes/article.routes'

const PORT = process.env.PORT || 8000
const corsOptions = {
    origin: 'http://localhost:8080'
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(headers)
app.get('/', (req, res) => {
    res.json({message: 'Bienvenue !'})
})
app.use('/auth', authRoutes)
app.use('/categories', categoryRoutes)
app.use('/articles', articleRoutes)

mongoose.connect(DB_URI, {}, (err) => {
    if (err) {
        console.log('Failed to connect to database')
    } else {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
})