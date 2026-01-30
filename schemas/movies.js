const z = require('zod')

    const movieSchema = z.object({
        title: z.string({
            invalid_type_error: 'Movie title must be a string',
            required_error: 'movie title is required.'
        }),
        year: z.number().int().positive().min(1900).max(2026), //a darle un rango no precisa aclarar que es positivo.
        director: z.string(),
        duration: z.number().int().positive(),
        rate: z.number().min(0).max(10).default(0), //podemos ponerle que es opcional si no ponemos por defecto un valor.
        poster: z.url({
            message: 'poster must be a valid url'
        }),
        genre: z.array(z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi', 'Crime']),
        {
            invalid_type_error: 'movie genre must be an array of enum genre.',
            required_error: 'movie genre is required.'
        })     
    })
  
function validateMovie (object){
    return movieSchema.safeParse(object)
}

function validatePartialMovie (object){
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}