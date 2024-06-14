import React, { Component } from "react"
import "./Film.css"
import { format } from "date-fns"
import { Tag, Rate } from "antd"

import { MyContext } from "../Context/Context"

import img from "./backfall-poster.png"

export default class Film extends Component {
  constructor() {
    super()
    this.state = {
      vote: 1
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
    const { name, images, date, overview, id, guestSessionId, rating, handleData, stars, ratingPost } = this.props
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
          <img
            src={images ? `https://image.tmdb.org/t/p/original${images}` : img}
            className="filmImg"
            alt="Movie poster"
          />
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
                className="rate"
                allowHalf
                defaultValue={stars}
                count={10}
                onChange={(e) =>
                  this.setState({ vote: e }, () =>
                    ratingPost(e, id, guestSessionId)
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
