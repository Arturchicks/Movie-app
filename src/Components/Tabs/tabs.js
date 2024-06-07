import React, { Component } from "react"
import { Tabs } from "antd"
import "./tabs.css"

export default class Tab extends Component {
  constructor() {
    super()
    this.state = {
      tabed: false,
    }
  }
  render() {
    const { apiKey, guestSessionId, passData, passTab, passIsTab } = this.props
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }
    const items = [
      {
        key: "1",
        label: "Search",
        // children: "Content of Tab Pane 1",
      },
      {
        key: "2",
        label: "Rated",
      },
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
            fetch(
              `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${apiKey}&language=en-US&page=1&sort_by=created_at.asc`,
              options
            )
              .then((response) => response.json())
              .then((response) => {
                if (response) handleProp(response)
                console.log(response.results)
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
