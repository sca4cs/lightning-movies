/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Lightning, Utils } from '@lightningjs/sdk'
import { getMovies } from './lib/api'
import { Box } from './Box'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

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

  async _init() {
    this.addDataToScreen(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.APP_MOVIES_API_KEY}`)
  }

  _handleDown() {
    this.tag('Container').patch({
      y: this.tag('Container').y - 20
    })
  }

  _handleUp() {
    this.tag('Container').patch({
      y: this.tag('Container').y + 20
    })
  }

  async addDataToScreen(url) {
    const data = await getMovies(url)
    console.log('data:', data)
    this.next = data.page++

    let movies = data.results.map((movie) => {
      return {
        type: Box,
        label: movie.title,
        movieImage: `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`
      }
    })

    // let tempChildren = this.tag('Container').children

    this.tag('Container').patch({
      children: movies
    })
  }
}
