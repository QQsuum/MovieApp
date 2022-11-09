import React, { Component } from 'react'
import MoviesList from '../movie-list/movies-list'
import SearchPanel from '../search-panel/search-panel'
import ApiService from '../../services/api-service'
import NoElements from '../no-elements/no-elements'
import MoviePagination from '../movie-pagination/movie-pagination'
import GenresContext from '../genres-context/genres-context'

import MovieTabs from '../tabs/tabs'

import 'antd/dist/antd.css'
import './app.css'
import '../tabs/tabs.css'

export default class App extends Component {
  apiService = new ApiService()

  onRated = async () => {
    this.setState({ loading: true })
    let data = JSON.parse(localStorage.getItem('ratedMovies'))
    let result = []
    for await (let i of data) {
      await this.apiService.getMovie(i.movieId).then((item) => result.push(item))
    }
    await this.onRatedListLoaded(result)
    this.setState({ data: result })
  }

  onSearch = (search = '', page = 1) => {
    if (search === '')
      return this.setState({ data: [], loading: false, error: false, noElements: false })
    this.setState({ loading: true, search: search })
    return this.apiService
      .getBySearch(search, page)
      .then(this.onListLoaded)
      .catch((error) => {
        this.onError(error)
      })
  }
  onRatedListLoaded = (moviesData) => {
    this.setState({
      data: moviesData,
      loading: false,
      error: false,
      noElements: false,
      totalPages: Math.ceil(moviesData.length / 20),
    })
  }
  onListLoaded = (fullMoviesData) => {
    const moviesData = fullMoviesData.results
    this.setState({
      data: moviesData,
      loading: false,
      error: false,
      noElements: false,
      totalPages: fullMoviesData.total_pages,
    })
  }

  onError = (error) => {
    if (error.message === `Nothing found`)
      this.setState({
        noElements: true,
      })

    if (error.message === 'Internet error')
      return this.setState({
        loading: false,
        error: 'Some problems with Internet',
        errorMessage: "Probably you don't have network connection",
        errorType: 'warning',
      })
    return this.setState({
      error: error.message,
      loading: false,
      errorMessage: 'Something went wrong',
      errorType: 'error',
    })
  }

  componentDidMount = () => {
    this.apiService.getGenres().then((genresData) => this.setState({ genres: genresData }))
  }

  state = {
    data: [],
    search: null,
    ratedData: localStorage.getItem('ratedMovies'),
    genres: [],
    loading: false,
    error: false,
    errorMessage: null,
    errorType: null,
    noElements: false,
    totalPages: null,
  }

  render() {
    const { noElements, data, search, error } = this.state

    const searchPanel = <SearchPanel onSearch={this.onSearch} key="searchPanel" />
    const content = noElements ? (
      <NoElements key="noEl" />
    ) : (
      <MoviesList options={this.state} key="movieList" />
    )

    const noNeedPagination = error || noElements || data.length < 20
    const pagination = noNeedPagination ? null : (
      <MoviePagination
        totalPages={this.state.totalPages}
        onPageChange={(page) => this.onSearch(search, page)}
      />
    )

    return (
      <GenresContext.Provider value={this.state.genres}>
        <div className="movie-app">
          <MovieTabs
            content={content}
            searchPanel={searchPanel}
            onRated={this.onRated}
            onSearch={this.onSearch}
          />
          {pagination}
        </div>
      </GenresContext.Provider>
    )
  }
}
