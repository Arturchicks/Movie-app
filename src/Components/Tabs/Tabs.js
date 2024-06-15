import React, { Component } from "react"
import { Tabs } from "antd"
import "./Tabs.css"

export default class Tab extends Component {
  constructor() {
    super()
    this.state = {
      tabed: false
    }
  }
  render() {
    const { guestSessionId, passData, passTab, passIsTab, rated_current_page, getRatedMovies } = this.props
    const items = [
      {
        key: "1",
        label: "Search"
      },
      {
        key: "2",
        label: "Rated"
      }
    ]
    const handleProp = (data) => {
      passData(data)
    }
    const handleTab = (tab) => {
      passTab(tab)
    }
    const handleIsTab = (isTab) => {
      passIsTab(isTab)
    }

    return (
      <Tabs
        defaultActiveKey="1"
        destroyInactiveTabPane={false}
        items={items}
        onTabClick={(e) => {
          if (e === "2") {
            handleTab(e)
            handleIsTab(true)
            getRatedMovies(guestSessionId, rated_current_page).then((response) => {
              if (response) handleProp(response)
            })
          }
          if ((this.state.tabed && e === "1") || e === "1") {
            handleTab(e)
            handleIsTab(false)
          }
        }}
      />
    )
  }
}
