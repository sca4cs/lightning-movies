import { MoviesHome } from '../MoviesHome'
import { MovieDetails } from '../MovieDetails'

export default {
  root: 'movies',
  routes: [
    {
      path: 'movies',
      component: MoviesHome,
    },
    {
      path: 'movies/:id',
      component: MovieDetails,
    },
  ],
}