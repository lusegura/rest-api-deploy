//1. creamos servidor e importamos JSON
const express = require('express') //requiere -> common js.
const crypto = require('node:crypto')
//const cors = require('cors')

const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

//2. creamos la app
const app = express()
//app.use(cors()) //middleware de cors, permite todo.
/*app.use(cors({
    origin: (origin, callback){
        const ACCEPTED_ORIGINS =['http://localhost:1234', 'http://localhost:8080', 'http://localhost:3000','http://movies.com']
        if(ACCEPTED_ORIGINS.includes(origin)){
            return callback(null, true)
        }
        if(!origin){
            return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))

    }
})) */
app.disable('x-powered-by')
app.use(express.json()) //middleware

// ejemplo regex en url:
//app.get('/ab+cd',(req,res)=>{ puede estar mas de una vez la b, ejemplo: abcd abbcd abbbbbbcd
//app.get('ab?cd',(req,res)=>{  puede estar o no la b, ejemplo: abcd, acd
//app.get('ab(cd)?e',(req,res)=>{  puede ser c o d, ejemplo: abe, abcde
//app.get('.*dev$',(req,res)=>{  regex, ejemplo todo lo que termina en dev, ej: midudev, manzdev

const ACCEPTED_ORIGINS =['http://localhost:1234', 'http://localhost:8080', 'http://localhost:3000','http://movies.com']

// todos los recursos que sean movies se identifican con /movies.
app.get('/movies',(req,res)=>{
    const origin = req.header('origin')
    if(ACCEPTED_ORIGINS.includes(origin) || !origin){ 
        res.header('Access-Control-Allow-Origin', origin)
    }
    const {genre} = req.query 
    if(genre){
        //const filteredMovies = movies.filter(movie => movie.genre.includes(genre)) // case sensitive
        const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() == genre.toLowerCase())) //deja de ser case sensitive, evalua todo en minuscula
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.get('/movies/:id', (req,res)=>{ //path-to-regexp
    const {id} = req.params
    const movie = movies.find(movie=>movie.id == id)
    if(movie) return res.json(movie)

    res.status(404).json({message: 'Movie not found'})
})

app.post('/movies', (req, res)=>{
    const result = validateMovie(req.body)

    if(result.error){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    //en BD
    const newMovie = {
        id: crypto.randomUUID(), // Crea una uuid V4 = identificador unico universal version4
        ...result.data
    }

    movies.push(newMovie) //esto no es REST porque guardamos el estado de la app en memoria.
    res.status(201).json(newMovie) //devolvemos recurso creado para actualizar cache de cliente.
})

app.delete('/movies/:id', (req,res)=>{
    const origin = req.header('origin')
    if(ACCEPTED_ORIGINS.includes(origin) || !origin){ 
        res.header('Access-Control-Allow-Origin', origin)
    }
    const {id} = req.params   
    const movieIndex = movies.findIndex(movie=>movie.id == id) 
    if(movieIndex == -1){
        return res.status(404).json({message: 'movie not found'})
    }
    movies.splice(movieIndex,1)
    return res.json({message: 'movie deleted'})

})

app.patch('/movies/:id', (req,res)=>{
    const result = validatePartialMovie(req.body)

    if(!result.success){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    } 

    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id == id)
    if(movieIndex == -1){
         return res.status(404).json({message: 'Movie not found'})
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    
    movies[movieIndex] = updateMovie
    
    return res.json(updateMovie)
})

app.options('/movies/:id', (req,res)=>{
    const origin = req.header('origin')
    if(ACCEPTED_ORIGINS.includes(origin) || !origin){ 
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    }
    res.send(200)
})

//puerto
const PORT = process.env.PORT ?? 1234
// escucha de puerto
app.listen(PORT,()=>{
    console.log(`server listening on port http://localhost:${PORT}`)
})

