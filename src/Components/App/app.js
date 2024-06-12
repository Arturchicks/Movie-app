import React, { Component } from "react"
import { Pagination } from "antd"
import { debounce } from "lodash"

import Service from "../Service/service"
import { MyContext } from "../Context/context"
import "./app.css"
import Tab from "../Tabs/tabs"
import SearchInput from "../SearchInput/input"
import Films from "../Films/films"

export default class App extends Component {
  constructor(props) {
    super(props)
    this.service = new Service()
    this.state = {
      filmData: [],
      filmDataRated: [],
      IdsNStars: [],
      fetched: false,
      total_pages: null,
      rated_total_pages: null,
      rated_current_page: 1,
      loaded: true,
      genreIds: [],
      onTab: null,
      isTabed: false,
      error: false,
      value: "",
      guestSessionId: null,
      options: {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer 8d41938f365dd86650d3e2dfdeb86fc1"
        }
      },
      accessToken:
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZDQxOTM4ZjM2NWRkODY2NTBkM2UyZGZkZWI4NmZjMSIsInN1YiI6IjY2NTUwMDJjNDgzOTIwYjM0Nzg5YjA4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AxZvjayWgj8Mri3jnXqqGmTA_eQHrCc1wZdB64PtL6s",
      apiKey: "8d41938f365dd86650d3e2dfdeb86fc1"
    }
    this.debouncedF = debounce((query) => this.getData(query), 1500)
    this.debouncedForPages = debounce((query, page) => {
      this.getData(query, page)
    }, 100)
  }

  handleDataFromChild = (val) => {
    this.setState({ value: val })
  }

  handleDataFromTabs = (val) => {
    if (val.results)
      this.setState(
        {
          filmDataRated: val.results.map((e) => {
            const find = this.state.filmData.find((el) => el.id === e.id)
            const notFind = this.state.IdsNStars.find((el) => el[0] === e.id)
            const stars = find ? find.stars : notFind[1]
            return {
              ...e,
              stars: stars
            }
          }),
          rated_total_pages: val.total_pages
        },
        console.log(this.state.filmDataRated)
      )
  }
  handleTabOn = (tab) => {
    this.setState({ onTab: tab })
  }
  handleIsTabed = (isTab) => {
    this.setState({ isTabed: isTab })
  }
  handleDataFromFilms = (id, stars) => {
    const { filmData, IdsNStars } = this.state
    IdsNStars.push([id, stars])
    filmData.map((e) => {
      if (e.id === id) {
        e.stars = stars
      }
    })
  }
  componentDidMount() {
    this.handleDataFromChild()
    this.service
      .createGuestSession()
      .then((response) =>
        this.setState({ guestSessionId: response.guest_session_id }, () => console.log(this.state.guestSessionId))
      )
    this.service.getGenreIds().then((response) =>
      this.setState(
        {
          genreIds: response.genres.reduce((acc, e) => {
            acc[e.id] = e.name
            return acc
          }, {})
        },
        () => console.log(this.state.genreIds)
      )
    )
  }
  componentDidUpdate() {
    this.handleDataFromFilms()
  }

  unClicked = () => {
    this.setState({ loaded: false })
  }
  onError = () => {
    this.setState({ error: true })
  }

  getData = (query, page) => {
    this.service
      .getFilmData(query, page)
      .then((response) => {
        if (response)
          this.setState(
            {
              filmData: [
                ...response.results
                  .filter((e) => e.overview !== "")
                  .map((e) => {
                    const find = this.state.IdsNStars.find((el) => el[0] === e.id)
                    const stars = find ? find[1] : 0
                    return {
                      ...e,
                      stars: stars
                    }
                  })
              ],
              total_pages: response.total_pages,
              loaded: true,
              fetched: true
            },
            () => console.log(this.state.filmData)
          )
      })
      .catch((err) => console.log(err))
  }
  getRatedMovies = (session, page) => {
    return this.service.getRatedMovies(session, page)
  }
  ratingPost = (id, vote, guest_session) => {
    return this.service.ratingPost(id, vote, guest_session)
  }

  render() {
    const { filmData, error, loaded, fetched, value, guestSessionId, apiKey } = this.state
    return (
      <div className="wrapper">
        <MyContext.Provider value={this.state.genreIds}>
          <Tab
            guestSessionId={guestSessionId}
            apiKey={apiKey}
            getRatedMovies={this.getRatedMovies}
            passData={this.handleDataFromTabs}
            passTab={this.handleTabOn}
            passIsTab={this.handleIsTabed}
            getData={this.getData}
            value={value}
            onDataFromChild={this.handleDataFromChild}
            passInput={this.handleInput}
            rated_current_page={this.state.rated_current_page}
          />
          <SearchInput
            getData={this.getData}
            filmData={filmData}
            total_pages={this.state.total_pages}
            fetched={fetched}
            onDataFromChild={this.handleDataFromChild}
            unClick={this.unClicked}
            loaded={loaded}
            isTabed={this.state.isTabed}
            filmDataRated={this.state.filmDataRated}
            passInput={this.handleInput}
            guestSessionId={guestSessionId}
            apiKey={apiKey}
            rated_total_pages={this.state.rated_total_pages}
          />
          <Films
            filmData={filmData}
            filmDataRated={this.state.filmDataRated}
            fetched={this.state.fetched}
            error={error}
            loaded={loaded}
            value={value}
            guestSessionId={this.state.guestSessionId}
            onTab={this.state.onTab}
            isTabed={this.state.isTabed}
            handleDataFromFilms={this.handleDataFromFilms}
            ratingPost={this.ratingPost}
          />
          {!this.state.isTabed && fetched && this.state.value && loaded && filmData.length > 0 && (
            <Pagination
              className="pagination"
              current={this.state.current_page}
              defaultCurrent={1}
              total={this.state.total_pages * 10}
              onChange={(e) => {
                this.setState({ current_page: e }, () => {
                  this.debouncedForPages(this.state.value, e, window.scrollTo(0, 0))
                })
              }}
              showSizeChanger={false}
              hideOnSinglePage
            />
          )}
          {this.state.isTabed && fetched && loaded && this.state.filmDataRated && (
            <Pagination
              className="pagination"
              current={this.state.rated_current_page}
              defaultCurrent={1}
              total={this.state.rated_total_pages * 10}
              onChange={(e) => {
                this.setState({ rated_current_page: e }, () => {
                  this.service.ratedFetch(this.state.rated_current_page, this.state.guestSessionId).then((response) => {
                    if (response.results) this.handleDataFromTabs(response)
                  })
                })
              }}
              showSizeChanger={false}
              hideOnSinglePage
            />
          )}
        </MyContext.Provider>
      </div>
    )
  }
}
