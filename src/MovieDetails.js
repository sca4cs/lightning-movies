import { Lightning, Router, Utils } from "@lightningjs/sdk"
import { getMovies } from './lib/api'

export class MovieDetails extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xff000000,
      },
      Title: {
        mount: 0.5,
        x: 960,
        y: 75,
        text: {
          text: '',
          fontSize: 64,
        }
      },
      Tagline: {
        mount: 0.5,
        x: 960,
        y: 150,
        text: {
          text: '',
        }
      },
      Image: {
        mountX: 0.5,
        x: 960,
        y: 200,
        src: '',
      },
      NavIndicator: {
        x: 120,
        y: 540,
        mount: 0.5,
        flex: {},
        Arrow: {
          src: Utils.asset('images/arrow.png'),
          rotation: Math.PI * -0.5
        },
        Label: {
          text: {
            text: 'Home',
          }
        },
        
      },
    }
  }

  _enable() {
    console.log(`Movie details for movie #${this.databaseId}.`)
    this.loadMovieDetails(`https://api.themoviedb.org/3/movie/${this.databaseId}?api_key=${process.env.APP_MOVIES_API_KEY}`)
  }

  _handleLeft() {
    Router.navigate('movies')
  }

  set params(data) {
    this.databaseId = data.id
  }

  async loadMovieDetails(url) {
    const data = await getMovies(url)
    console.log('movie details data:', data)

    this.tag('Title').patch({
      text: {
        text: data.title,
      }
    })

    this.tag('Tagline').patch({
      text: {
        text: data.tagline,
      }
    })

    this.tag('Image').patch({
      src: `https://image.tmdb.org/t/p/w500${data.backdrop_path}`,
    })
  }
}