import React, { Component } from "react"

import { MyContext } from "../Context/context"
import "./app.css"
import Tab from "../Tabs/tabs"
import SearchInput from "../SearchInput/input"
import Films from "../Films/films"
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filmData: [],
      filmDataRated: [],
      IdsNStars: [],
      fetched: false,
      total_pages: null,
      rated_total_pages: null,
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
          Authorization: "Bearer 8d41938f365dd86650d3e2dfdeb86fc1",
        },
      },
      accessToken:
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZDQxOTM4ZjM2NWRkODY2NTBkM2UyZGZkZWI4NmZjMSIsInN1YiI6IjY2NTUwMDJjNDgzOTIwYjM0Nzg5YjA4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AxZvjayWgj8Mri3jnXqqGmTA_eQHrCc1wZdB64PtL6s",
      apiKey: "8d41938f365dd86650d3e2dfdeb86fc1",
    }
  }
  handleDataFromChild = (val) => {
    this.setState({ value: val })
  }
  handleInput = (val) => {
    this.setState({ filmDataRated: val })
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
              stars: stars,
            }
          }),
          rated_total_pages: val.total_pages,
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
    this.createGuestSession()
    this.getGenreIds()
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
  createGuestSession = () => {
    fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.state.apiKey}`)
      .then((response) => response.json())
      .then((response) =>
        this.setState({ guestSessionId: response.guest_session_id }, () => console.log(this.state.guestSessionId))
      )
  }
  getGenreIds = () => {
    fetch("https://api.themoviedb.org/3/genre/movie/list", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZDQxOTM4ZjM2NWRkODY2NTBkM2UyZGZkZWI4NmZjMSIsInN1YiI6IjY2NTUwMDJjNDgzOTIwYjM0Nzg5YjA4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AxZvjayWgj8Mri3jnXqqGmTA_eQHrCc1wZdB64PtL6s",
      },
    })
      .then((response) => response.json())
      .then((response) =>
        this.setState({
          genreIds: response.genres.reduce((acc, e) => {
            acc[e.id] = e.name
            return acc
          }, {}),
        })
      )
  }

  getData = (query = "", page = 1) => {
    const { apiKey, options } = this.state
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&include_adult=false&language=en-US&page=${page}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        if (response)
          this.setState({
            filmData: [
              ...response.results
                .filter((e) => e.poster_path !== null && e.overview !== "")
                .map((e) => {
                  const find = this.state.IdsNStars.find((el) => el[0] === e.id)
                  const stars = find ? find[1] : 0
                  return {
                    ...e,
                    stars: stars,
                  }
                }),
            ],
            total_pages: response.total_pages,
            loaded: true,
            fetched: true,
          })
      })
      .catch((err) => console.log(err))
  }
  render() {
    const { filmData, error, loaded, fetched, value, guestSessionId, apiKey } = this.state
    return (
      <div>
        <MyContext.Provider value={this.state.genreIds}>
          <Tab
            guestSessionId={guestSessionId}
            apiKey={apiKey}
            passData={this.handleDataFromTabs}
            passTab={this.handleTabOn}
            passIsTab={this.handleIsTabed}
            getData={this.getData}
            value={value}
            onDataFromChild={this.handleDataFromChild}
            passInput={this.handleInput}
          />
          <SearchInput
            getData={this.getData.bind(this)}
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
          />
        </MyContext.Provider>
      </div>
    )
  }
}
