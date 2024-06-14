import { Component } from "react"

export default class Service extends Component {
  constructor() {
    super()
    this.state = {
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
  }
  createGuestSession = async () => {
    return await fetch(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.state.apiKey}`
    ).then((response) => response.json())
  }
  getGenreIds = async () => {
    return await fetch("https://api.themoviedb.org/3/genre/movie/list", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${this.state.accessToken}`
      }
    }).then((response) => response.json())
  }
  ratedFetch = async (page, session) => {
    return await fetch(
      `https://api.themoviedb.org/3/guest_session/${session}/rated/movies?api_key=${this.state.apiKey}&language=en-US&page=${page}&sort_by=created_at.asc`,
      {
        method: "GET",
        headers: {
          accept: "application/json"
        }
      }
    ).then((response) => response.json())
  }
  getFilmData = async (query = "", page = 1) => {
    const { apiKey, options } = this.state
    return await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&include_adult=false&language=en-US&page=${page}`,
      options
    ).then((response) => response.json())
  }
  getRatedMovies = async (session, page) => {
    const { apiKey, options } = this.state
    return await fetch(
      `https://api.themoviedb.org/3/guest_session/${session}/rated/movies?api_key=${apiKey}&language=en-US&page=${page}&sort_by=created_at.asc`,
      options
    ).then((response) => response.json())
  }
  ratingPost = async (vote, id, guest_session) => {
    const { apiKey } = this.state
    return await fetch(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${apiKey}&guest_session_id=${guest_session}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
          Authorization: "Bearer 8d41938f365dd86650d3e2dfdeb86fc1"
        },
        body: JSON.stringify({ value: vote })
      }
    )
  }
}
