import { result } from 'lodash'
import React, { Component } from 'react'
export default class ApiService extends Component {
  _apiBase = 'https://api.themoviedb.org/3'

  bearer =
    'Bearer ' +
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4M2Q1NjYxNDMwM2ExZWM4M2U2ZDM4NTdhNDQyMjc3NSIsInN1YiI6IjYzNTExY2E0ODQ0NDhlMDA3Zjc3NDI5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wJWkO4_-w_pT2j8ecIy9U7UGl3Uc_2K3ylANh6QJ0sA'
  apiKey = 'api_key=83d56614303a1ec83e6d3857a4422775'

  userId = null

  getResource = async (url) => {
    const res = await fetch(`${this._apiBase}${url}${this.apiKey}`, {
      headers: { Authorization: this.bearer },
    }).catch((err) => {
      if (!navigator.onLine) {
        throw new Error(`Internet error`)
      }
    })

    const body = await res.json()

    if (!res.ok && navigator.onLine) {
      throw new Error(`Recieved ${res.status}`)
    }

    return body
  }

  postMovieRate = (movieId, rate) => {
    const ratedMovies = localStorage.getItem('ratedMovies')
    if (!ratedMovies) {
      return localStorage.setItem(`ratedMovies`, JSON.stringify([{ movieId: movieId, rate: rate }]))
    }
    let ratedMoviesParse = JSON.parse(ratedMovies)

    if (ratedMovies.includes(`${movieId}`)) {
      const result = ratedMoviesParse.map((item) => {
        if (item.movieId == movieId) {
          return { movieId: item.movieId, rate: rate }
        }
        return item
      })
      return localStorage.setItem('ratedMovies', JSON.stringify(result))
    }

    ratedMoviesParse.push({ movieId: movieId, rate: rate })
    localStorage.setItem(`ratedMovies`, JSON.stringify(ratedMoviesParse))
  }

  getRated() {
    const movieId = localStorage.getItem('ratedMovies')
  }

  getBySearch(searchQuery, page = 1) {
    return this.getResource(`/search/movie?page=${page}&language=en-US&query=${searchQuery}&`).then(
      (body) => {
        if (body.results.length === 0 && navigator.onLine) {
          throw new Error(`Nothing found`)
        }
        return body
      }
    )
  }

  getMovie(id) {
    return this.getResource(`/movie/${id}?`)
  }

  getGenres = async () => {
    return this.getResource(`/genre/movie/list?`).then((body) => body.genres)
  }
}
