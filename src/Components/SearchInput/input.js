import React, { Component } from "react"
import "./search-input.css"
import { Input } from "antd"
import { debounce } from "lodash"

export default class SearchInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: "",
      prevValue: null,
      isDebounced: false,
      exception: false
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

  render() {
    const { unClick, isTabed, handlePage } = this.props
    if (!isTabed)
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
                    { value: e.target.value },
                    this.debouncedF(e.target.value, this.state.current_page),
                    handlePage()
                  )
                }
              }
            }}
            onKeyDown={(e) => {
              if (this.state.value === "" && e.key === " ") {
                e.preventDefault()
              }
            }}
          />
        </>
      )
  }
}
