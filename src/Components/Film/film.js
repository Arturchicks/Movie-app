import React, { Component } from "react"
import "./film.css"
import { format } from "date-fns"
import { Tag, Rate } from "antd"

import { MyContext } from "../Context/context"

export default class Film extends Component {
  constructor() {
    super()
    this.state = {
      vote: 1,
      options: {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
          Authorization: "Bearer 8d41938f365dd86650d3e2dfdeb86fc1",
        },
        body: JSON.stringify({ value: this.vote }),
      },
      apiKey: "8d41938f365dd86650d3e2dfdeb86fc1",
      accessToken:
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZDQxOTM4ZjM2NWRkODY2NTBkM2UyZGZkZWI4NmZjMSIsInN1YiI6IjY2NTUwMDJjNDgzOTIwYjM0Nzg5YjA4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AxZvjayWgj8Mri3jnXqqGmTA_eQHrCc1wZdB64PtL6s",
    }
  }

  genreFunc = (e) => {
    return this.context[e]
  }
  genres = () => {
    const { genre } = this.props
    return genre.slice(0, 3).map((e) => {
      return (
        <li className="genre" key={e + 3}>
          <>
            <Tag>{this.genreFunc(e)}</Tag>
          </>
        </li>
      )
    })
  }
  componentDidMount = () => {
    this.genres()
  }
  render() {
    const { name, images, date, overview, id, guestSessionId, rating, handleData, stars } = this.props
    const { apiKey } = this.state
    const colorFunc = () => {
      let classN
      if (rating >= 0 && rating < 3) {
        classN = "bad"
      } else if (rating >= 3 && rating < 5) {
        classN = "not-bad"
      } else if (rating >= 5 && rating <= 7) {
        classN = "good"
      } else if (rating > 7) {
        classN = "very-good"
      }
      return classN
    }
    return (
      <li className="filmCard">
        <div className="filmCardWrapper">
          <img src={`https://image.tmdb.org/t/p/original${images}`} className="filmImg"></img>
          <div className="info-field">
            <div className="filmCardHeader">
              <span className="name">{name}</span>
              <div className={`rateBox ${colorFunc()}`}>
                <span className="rating">{rating}</span>
              </div>
            </div>
            <span className="date">{format(date, "PP")}</span>
            <div>
              <ul className="genres">{this.genres()}</ul>
            </div>
            <div className="footer">
              <span className="overview">{overview}</span>
              <Rate
                allowHalf
                defaultValue={stars}
                count={10}
                onChange={(e) =>
                  this.setState({ vote: e }, () =>
                    fetch(
                      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${apiKey}&guest_session_id=${guestSessionId}`,
                      {
                        method: "POST",
                        headers: {
                          accept: "application/json",
                          "Content-Type": "application/json;charset=utf-8",
                          Authorization: "Bearer 8d41938f365dd86650d3e2dfdeb86fc1",
                        },
                        body: JSON.stringify({ value: this.state.vote }),
                      }
                    )
                      .then(() => handleData(id, e))
                      .catch((err) => console.log(err))
                  )
                }
              />
            </div>
          </div>
        </div>
      </li>
    )
  }
}
Film.contextType = MyContext