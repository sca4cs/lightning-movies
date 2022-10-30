import { Router, Lightning } from '@lightningjs/sdk'
import { getMovies } from './lib/api'
import { Poster } from './Poster'

export class MoviesHome extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xff000000,
      },
      TitleBanner: {
        rect: true,
        zIndex: 2,
        w: 1920,
        h: 100,
        color: 0xff000000,
        Title: {
          x: 25,
          y: 10,
          text: {
            text: 'Upcoming Movies',
            fontSize: 64,
          },
        }
      },
      Container: {
        y: 100,
        w: 1920 - 50,
        rect: true,
        color: 0x00000000,
        flex: {
          direction: 'row',
          padding: 25,
          wrap: true,
          justifyContent: 'space-between',
          alignItems: 'center'
        },
      },
      
    }
  }

  _init() {
    this.index = -1

    this.addDataToScreen(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.APP_MOVIES_API_KEY}`)
  }

  getActiveItem() {
    return this.tag('Container').children[this.index]
  }

  _getFocused() {
    return this.getActiveItem()
  }

  _handleEnter() {
    Router.navigate(`movies/${this.getActiveItem().databaseId}`)
  }

  _handleRight() {
    if(this.index < this.tag('Container').children.length - 1) {
      this.index++;
    }
    this._refocus()
  }

  _handleLeft() {
    if(this.index > 0) {
      this.index--;
    }
    this._refocus()
  }

  _handleDown() {
    if (this.index == -1) {
      this.index = 0
    } else if (this.index + 5 < this.tag('Container').children.length - 1) {
      this.index += 5

      this.tag('Container').patch({
        smooth: {
          y: this.tag('Container').y - 400,
        },
      })
    }
  }

  _handleUp() {
    if (this.index - 5 > -1) {
      this.index -= 5

      this.tag('Container').patch({
        smooth: {
          y: this.tag('Container').y + 400
        },
      })
    }
  }

  async addDataToScreen(url) {
    const data = await getMovies(url)

    let movies = data.results.map((movie) => {
      return {
        type: Poster,
        label: movie.title,
        movieImage: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
        databaseId: movie.id
      }
    })

    this.tag('Container').patch({
      children: movies
    })
  }
}
