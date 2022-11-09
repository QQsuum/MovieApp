import React, { Component } from 'react'
import { Pagination } from 'antd'
import './movie-pagination.css'
import 'antd/dist/antd.css'

export default class MoviePagination extends Component {
  onPageChange = (page) => {
    this.props.onPageChange(page)
  }

  render() {
    return (
      <div className="movie-pagination">
        <Pagination
          total={this.props.totalPages}
          showSizeChanger={false}
          showQuickJumper={false}
          itemRender={(page, type, originalElement) => {
            if (type === 'page') {
              return <a onClick={() => this.onPageChange(page)}>{page}</a>
            }
            return originalElement
          }}
        />
      </div>
    )
  }
}
