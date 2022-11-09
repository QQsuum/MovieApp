import React, { Component, Fragment } from 'react'
import { Alert, Spin } from 'antd'

import Movie from '../movie/movie'

import './movie-list.css'
import '../alert/alert.css'

export default class MoviesList extends Component {
  render() {
    const { data, loading, error, errorMessage, errorType } = this.props.options
    const movies = data.map((movie) => {
      const { ...movieProps } = movie

      return (
        <li key={movie.id} className="movie-item">
          <Movie {...movieProps} />
        </li>
      )
    })

    const hasData = !(loading || error)

    const spinner = loading ? <Spin size="large" /> : null
    const hasError = error ? (
      <Alert message={error} description={errorMessage} type={errorType} showIcon />
    ) : null
    const content = hasData ? <ul className="movies-list">{movies}</ul> : null

    return (
      <>
        {hasError}
        {spinner}
        {content}
      </>
    )
  }
}
