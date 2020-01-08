import React, { Component } from 'react'
import { Empty } from 'antd'

export class EmptyDetail extends Component {
  render() {
    return (
      <Empty
        className={"justifyCenter"}
        style={{ height: "100%", flexDirection: "column" }}
        image="/credit_card_home.svg"
        imageStyle={{
          height: "250px",
        }}
        description={
          <span>
            <strong>
              Hi, Welcome back :D
            </strong>
            <br />
            <i>
              Don't Worry, Enjoy your life.
            </i>
          </span>
        }
      />
    )
  }
}

export default EmptyDetail
