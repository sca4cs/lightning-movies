import { Lightning, Router, Utils } from "@lightningjs/sdk"
import { Carousel } from '@lightningjs/ui'
import { getMovies } from './lib/api'
import { NavIndicator } from "./components/NavIndicator"
import { Poster } from './Poster'

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
        x: 450,
        y: 75,
        text: {
          text: '',
          fontSize: 64,
        }
      },
      Tagline: {
        x: 450,
        y: 155,
        text: {
          text: '',
        }
      },
      Image: {
        x: 450,
        y: 225,
        alpha: 1,
        src: '',
      },
      BackdropImage: {
        x: 450,
        y: 225,
        alpha: 0,
        src: '',
      },
      Date: {
        x: 1000,
        y: 225,
        w: 600,
        text: {
          text: '',
          fontSize: 32,
        }
      },
      Description: {
        x: 1000,
        y: 300,
        w: 600,
        text: {
          text: '',
          fontSize: 32,
        }
      },
      RelatedTitlesIndicator: {
        x: 1000,
        y: 950,
        type: NavIndicator,
        textLabel: 'Related titles',
        arrowRotation: Math.PI * 1,
      },
      HomeIndicator: {
        x: 75,
        y: 75,
        type: NavIndicator,
        textLabel: 'Home',
        arrowRotation: Math.PI * -0.5,
      },
      MoviesCarousel: {
        y: 1080,
        w: 1920,
        h: 400,
        type: Carousel,
        scroll: 0.5,
        direction: 'row',
      }
    }
  }

  static _states() {
    return [
      class HomeIndicator extends this {
        _getFocused() {
          return this.tag('HomeIndicator')
        }
        _handleDown() {
          this._setState('RelatedTitlesIndicator')
        }
        _handleRight() {
          this._setState('RelatedTitlesIndicator')
        }
        _handleEnter() {
          Router.navigate('movies')
        }
        _handleBack() {
          Router.navigate('movies')
        }
      },
      class RelatedTitlesIndicator extends this {
        _getFocused() {
          return this.tag('RelatedTitlesIndicator')
        }
        _handleUp() {
          this._setState('HomeIndicator')
        }
        _handleLeft() {
          this._setState('HomeIndicator')
        }
        _handleEnter() {
          this.loadRelatedMovies(`https://api.themoviedb.org/3/movie/${this.databaseId}/similar?api_key=${process.env.APP_MOVIES_API_KEY}`)
          this._setState('MoviesCarousel')
        }
        _handleBack() {
          Router.navigate('movies')
        }
      },
      class MoviesCarousel extends this {
        _getFocused() {
          return this.tag('MoviesCarousel')
        }
        _handleUp() {
          this.goBackToMovieDetails()
          this._setState('HomeIndicator')
        }
        _handleBack() {
          this.goBackToMovieDetails()
          this._setState('HomeIndicator')
        }
      },
    ]
  }

  _init() {
    this._setState('HomeIndicator')

    this._animateDate = this.tag('Date').animation({
      duration: 2,
      actions: [
        {p: 'alpha', v: {0: 1, 1: 0}},
        {p: 'scale', v: {0: 1, 1: 0.75}},
      ],
    })

    this._animateDescription = this.tag('Description').animation({
      duration: 2,
      actions: [
        {p: 'alpha', v: {0: 1, 1: 0}},
        {p: 'scale', v: {0: 1, 1: 0.75}},
      ],
    })

    this._animateTitle = this.tag('Title').animation({
      duration: 2,
      actions: [
        {p: 'x', v: {0: 450, 1: 825}},
        {p: 'scale', v: {0: 1, 1: 0.75}},
      ],
    })

    this._animateTagline = this.tag('Tagline').animation({
      duration: 2,
      actions: [
        {p: 'x', v: {0: 450, 1: 800}},
        {p: 'scale', v: {0: 1, 1: 0.75}},
      ],
    })

    this._animateImage = this.tag('Image').animation({
      duration: 2,
      actions: [
        {p: 'x', v: {0: 450, 1: 400}},
        {p: 'y', v: {0: 225, 1: -60}},
        {p: 'alpha', v: {0: 1, 1: 0}},
        {p: 'scale', v: {0: 1, 1: 0.5}},
      ],
    })

    this._animateBackdropImage = this.tag('BackdropImage').animation({
      duration: 2,
      actions: [
        {p: 'x', v: {0: 450, 1: 350}},
        {p: 'y', v: {0: 225, 1: 85}},
        {p: 'alpha', v: {0: 0, 1: 1}},
      ],
    })

    this._animateMoviesCarousel = this.tag('MoviesCarousel').animation({
      duration: 2,
      actions: [
        {p: 'y', v: {0: 1100, 1: 500}},
      ],
    })
  }

  _enable() {
    this.loadMovieDetails(`https://api.themoviedb.org/3/movie/${this.databaseId}?api_key=${process.env.APP_MOVIES_API_KEY}`)
  }

  goBackToMovieDetails() {
    this._animateDate.stop()
    this._animateDescription.stop()
    this._animateTitle.stop()
    this._animateTagline.stop()
    this._animateImage.stop()
    this._animateBackdropImage.stop()
    this.tag('RelatedTitlesIndicator').patch({ alpha: 1 })
    this._animateMoviesCarousel.stop()
  }

  set params(data) {
    this.databaseId = data.id
  }

  async loadMovieDetails(url) {
    const data = await getMovies(url)

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

    const dateFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' })
    const dateAsFormattedString = dateFormatter.format(new Date(data.release_date))
    this.tag('Date').patch({
      text: {
        text: `Relase date: ${dateAsFormattedString}`,
      }
    })

    this.tag('Description').patch({
      text: {
        text: data.overview,
      }
    })

    this.tag('Image').patch({
      src: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    })

    this.tag('BackdropImage').patch({
      src: `https://image.tmdb.org/t/p/w500${data.backdrop_path}`,
    })
  }

  async loadRelatedMovies(url) {
    const data = await getMovies(url)
    let relatedMovies = data.results.map(movie => {
      return {
        w: 300,
        h: 450,
        margin: 15,
        type: Poster,
        label: movie.title,
        movieImage: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
        databaseId: movie.id
      }
    })
    // console.log('array:', relatedMovies)
    this.tag('MoviesCarousel').add(relatedMovies)

    this._animateDate.start()
    this._animateDescription.start()
    this._animateTitle.start()
    this._animateTagline.start()
    this._animateImage.start()
    this._animateBackdropImage.start()
    this.tag('RelatedTitlesIndicator').patch({ alpha: 0 })
    this._animateMoviesCarousel.start()
  }
}