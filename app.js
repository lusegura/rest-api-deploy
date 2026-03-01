//1. creamos servidor e importamos JSON
import express, { json } from 'express' //requiere -> common js.
import cors from 'cors'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

//2. creamos la app
const app = express()
app.use(cors()) //middleware de cors, permite todo.
app.use(corsMiddleware()) 
app.disable('x-powered-by')
app.use(json()) //middleware

// const ACCEPTED_ORIGINS =['http://localhost:1234', 'http://localhost:8080', 'http://localhost:3000','http://movies.com']

// app.options('/movies/:id', (req,res)=>{
//     const origin = req.header('origin')
//     if(ACCEPTED_ORIGINS.includes(origin) || !origin){ 
//         res.header('Access-Control-Allow-Origin', origin)
//         res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//     }
//     res.send(200)
// })

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT,()=>{
    console.log(`server listening on port http://localhost:${PORT}`)
})

