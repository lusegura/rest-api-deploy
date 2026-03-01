import movies from '../movies.json' with {type: 'json'}
import { randomUUID } from 'node:crypto'


export class MovieModel{
    static async getAll ({genre}){
        if(genre){
            const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() == genre.toLowerCase())) //deja de ser case sensitive, evalua todo en minuscula
            return filteredMovies
        }
        return movies
    }

    static async getById ({id}){
        const movie = movies.find(movie=>movie.id == id)
        return movie
    }

    static async create (input){
        //en BD
        const newMovie = {
            id: randomUUID(), // Crea una uuid V4 = identificador unico universal version4
            ...input
        }
        movies.push(newMovie) //esto no es REST porque guardamos el estado de la app en memoria.
        return newMovie
    }

    static async delete({id}){
        const movieIndex = movies.findIndex(movie=>movie.id == id) 
        if(movieIndex == -1) return false
        movies.splice(movieIndex,1)
        return true
    }
    
    static async update({id, input}){
        const movieIndex = movies.findIndex(movie => movie.id == id)
        if(movieIndex == -1){
            return res.status(404).json({message: 'Movie not found'})
        }

        const updateMovie = {
            ...movies[movieIndex],
            ...input.data
        }
    
        movies[movieIndex] = updateMovie
    }

}