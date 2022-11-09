import React, { Component } from 'react'
import { format } from 'date-fns'
import { Rate } from 'antd'
import GenresContext from '../genres-context/genres-context'
import ApiService from '../../services/api-service'

import './movie.css'

export default class Movie extends Component {
  static contextType = GenresContext

  apiService = new ApiService()

  key = 100

  createGenresNames = (genresId, genresData) => {
    let result = []
    genresId.forEach((el) => {
      genresData.forEach((item) => {
        if (el === item.id) {
          result.push(item.name)
        }
      })
    })
    this.setState({ genres: result })
    return result
  }

  createReleaseDate(gettingDate) {
    if (gettingDate == '' || gettingDate == undefined) {
      return 'Нет даты премьеры'
    }
    return format(new Date(gettingDate), 'LLLL d, uuuu')
  }

  createPosterPic(gettingPoster) {
    if (gettingPoster == '' || gettingPoster == undefined) {
      return 'https://onlinemultfilm.com/uploads/poster_none.png'
    }
    return `https://image.tmdb.org/t/p/w220_and_h330_face${gettingPoster}`
  }

  componentDidMount() {
    if (!this.props.genre_ids) {
      return this.createGenresNames(this.props.genres, this.context)
    }
    this.createGenresNames(this.props.genre_ids, this.context)
  }

  createVoteClassName(vote) {
    let result
    if (vote == 0) {
      result = 'movie__vote'
    } else if (vote <= 3) {
      result = 'movie__vote movie__vote--red'
    } else if (vote <= 5) {
      result = 'movie__vote movie__vote--orange'
    } else if (vote < 7) {
      result = 'movie__vote movie__vote--yellow'
    } else if (vote >= 7) {
      result = 'movie__vote movie__vote--green'
    }
    return result
  }

  onMovieRate = (id, value) => {
    this.apiService.postMovieRate(id, value)
  }

  createRatedValue() {
    let result = 0
    let { ratedMovies } = this.state
    ratedMovies = JSON.parse(ratedMovies)

    for (let i in ratedMovies) {
      if (ratedMovies[i].movieId == this.props.id) {
        result = ratedMovies[i].rate
      }
    }
    return result
  }

  onShowMore = () => {
    this.state.overviewHeight == null
      ? this.setState({ overviewHeight: 105, movieItemHeight: 280, movieCardHeight: 280 })
      : this.setState({ overviewHeight: null, movieItemHeight: null, movieCardHeight: null })
  }

  state = {
    genres: [],
    ratedMovies: localStorage.getItem('ratedMovies'),
    overviewHeight: 105,
    movieItemHeight: 280,
    movieCardHeight: 280,
  }

  render() {
    const { id, title, vote_average, release_date, overview, poster_path } = this.props

    const date = this.createReleaseDate(release_date)

    const overviewStyle = this.state.overviewHeight ? { maxHeight: `${this.state.overviewHeight}px` } : null
    const movieItemStyle = this.state.movieItemHeight
      ? { height: `${this.state.movieItemHeight}px` }
      : { minHeight: `280px` }
      const overviewFade = overviewStyle  ? <div className="movie__overview-fade"></div> : null

    const voteClassName = this.createVoteClassName(vote_average)

    const poster = this.createPosterPic(poster_path)

    const rate = this.createRatedValue()
    const vote = vote_average == 0 ? null : vote_average.toFixed(1)
    const genres = this.state.genres.map((genre) => {
      return (
        <li className="movie__genres-item" key={this.key++}>
          {genre}
        </li>
      )
    })

    return (
      <GenresContext.Consumer>
        {(genresData) => {
          return (
            <div className="movie">
              <img className="movie__poster" src={poster} />
              <div className="movie-info" style={movieItemStyle}>
                <div className="movie__title">{title}</div>
                <div className={voteClassName}>{vote}</div>
                <div className="movie__release-date">{date}</div>
                <ul className="movie__genres">{genres}</ul>
                <div className="movie__overview" style={overviewStyle}>
                  {overview}
                  {overviewFade}
                </div>

                <button className="movie__show-more btn" onClick={this.onShowMore}>
                  ...
                </button>

                <Rate
                  count={10}
                  // defaultValue={rate== null || !rate.includes(id) ? this.state.rate : this.createRate() }
                  defaultValue={rate}
                  allowHalf
                  style={{
                    fontSize: '14px',
                    textAlign: 'center',

                    bottom: '15px',
                    margin: '8px 0',
                  }}
                  onChange={(value) => this.onMovieRate(this.props.id, value)}
                />
              </div>
            </div>
          )
        }}
      </GenresContext.Consumer>
    )
  }
}
