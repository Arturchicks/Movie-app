import React, { Component } from "react"
import "./films.css"
import { Spin, Alert } from "antd"

import Film from "../Film/film"
import { MyContext } from "../Context/context"

export default class Films extends Component {
  handleData = (id, stars) => {
    this.props.handleDataFromFilms(id, stars)
  }
  render() {
    const { filmData, error, loaded, fetched, value, guestSessionId, isTabed, filmDataRated, ratingPost } = this.props

    const stringCut = (cut, length) => {
      if (cut.length > 0)
        if (cut.length > length) {
          let cutView = cut.split("").toSpliced(150, cut.length)
          cutView = cutView.join("").split(" ")
          cutView.pop()

          return cutView.join(" ") + "..."
        } else {
          return cut
        }
    }

    let films
    if (filmData) {
      films = filmData.map((e) => {
        return (
          <Film
            name={stringCut(e.title, 50)}
            key={e.id}
            id={e.id}
            filmData={filmData}
            handleData={this.handleData}
            stars={e.stars}
            filmDataRated={filmDataRated}
            rating={e.vote_average === 10 ? 10 : e.vote_average.toFixed(1)}
            genre={e.genre_ids}
            guestSessionId={guestSessionId}
            images={e.poster_path}
            date={e.release_date !== "" ? e.release_date : new Date(null)}
            overview={stringCut(e.overview, 150)}
            ratingPost={ratingPost}
          />
        )
      })
    }
    let ratedFilms
    if (filmDataRated) {
      ratedFilms = filmDataRated.map((e) => {
        return (
          <Film
            name={stringCut(e.title, 50)}
            key={e.id}
            id={e.id}
            stars={e.stars}
            handleData={this.handleData}
            rating={e.vote_average === 10 ? 10 : e.vote_average.toFixed(1)}
            genre={e.genre_ids}
            guestSessionId={guestSessionId}
            images={e.poster_path}
            date={e.release_date !== "" ? e.release_date : new Date(null)}
            overview={stringCut(e.overview, 150)}
            ratingPost={ratingPost}
          />
        )
      })
    }

    if (!loaded && value !== "") {
      return (
        <div className="loading">
          <Spin className="loading" tip="Loading" size="large"></Spin>
        </div>
      )
    } else if (error) {
      return <Alert message={"Something went wrong..."} type="error" />
    } else if (filmData.length === 0 && fetched && loaded && value !== "" && !isTabed) {
      return (
        <Alert
          className="alert"
          message="Ничего не найдено"
          description="По вашему запросу не нашлось результатов"
          type="info"
          showIcon
        />
      )
    } else if (loaded && value !== "" && !isTabed) {
      return <ul className="film-list">{films}</ul>
    } else if (isTabed) return <ul className="film-list">{ratedFilms}</ul>
  }
}
Films.contextType = MyContext
