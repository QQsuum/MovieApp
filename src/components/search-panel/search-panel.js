import React, { Component } from 'react'
import { debounce } from 'lodash'
import './search-panel.css'

export default class SearchPanel extends Component {
  searchQuery = debounce((val) => this.props.onSearch(val), 500)

  onSearchPanelChange = (e) => {
    this.setState(() => {
      return { search: e.target.value }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState === this.state) return

    this.searchQuery(this.state.search)
  }

  state = {
    search: '',
  }
  render() {
    return (
      <input
        className="search-panel"
        placeholder="Type to search..."
        onChange={this.onSearchPanelChange}
      />
    )
  }
}
