import React, { Component } from "react"
import "./search-input.css"
import { Input, Pagination } from "antd"
import { debounce } from "lodash"

export default class SearchInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: "",
      prevValue: null,
      isDebounced: false,
      current_page: 1,
      rated_current_page: 1,
      exception: false,
    }
    const { getData } = this.props
    this.debouncedF = debounce((query) => getData(query), 1500)
    this.debouncedForPages = debounce((query, page) => {
      getData(query, page)
    }, 100)
  }
  handleData = (val) => {
    this.props.onDataFromChild(val)
  }
  handleInput = (val) => {
    this.props.passInput(val)
  }
  updateDate = () => {
    this.setState({ value: "" })
  }
  ratedFetch = (page) => {
    const { guestSessionId, apiKey } = this.props
    fetch(
      `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${apiKey}&language=en-US&page=${page}&sort_by=created_at.asc`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.results) this.handleInput(response.results)
      })
  }
  render() {
    const { unClick, total_pages, isTabed, fetched, filmData, loaded, rated_total_pages, filmDataRated } = this.props
    return (
      <>
        <Input
          size="large"
          placeholder="Type to search..."
          className="input"
          value={this.state.value}
          onChange={(e) => {
            this.setState({ value: e.target.value }, this.handleData(e.target.value))
            if (!isTabed) {
              if (e.key !== "Backspace") {
                unClick()
                this.setState(
                  { value: e.target.value, current_page: 1 },
                  this.debouncedF(e.target.value, this.state.current_page)
                )
              }
            }
            if (isTabed) {
              this.setState({ value: e.target.value }, () => {
                this.ratedFetch()
              })
            }
          }}
          onKeyDown={(e) => {
            if (this.state.value === "" && e.key === " ") {
              e.preventDefault()
            }
          }}
        />
        {!isTabed && fetched && this.state.value && loaded && filmData.length > 0 && (
          <Pagination
            className="pagination"
            current={this.state.current_page}
            defaultCurrent={1}
            total={total_pages * 10}
            onChange={(e) => {
              this.setState({ current_page: e }, () => {
                this.debouncedForPages(this.state.value, e)
              })
            }}
            showSizeChanger={false}
          />
        )}
        {isTabed && fetched && loaded && filmDataRated && (
          <Pagination
            current={this.state.rated_current_page}
            defaultCurrent={1}
            total={rated_total_pages * 10}
            onChange={(e) => {
              this.setState({ rated_current_page: e }, () => {
                this.ratedFetch(this.state.rated_current_page)
              })
            }}
            showSizeChanger={false}
            hideOnSinglePage
          />
        )}
      </>
    )
  }
}
