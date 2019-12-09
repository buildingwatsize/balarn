import React, { Component } from 'react'
import { Typography } from 'antd'

export class MenuShow extends Component {
  render() {
    console.log(this.props);
    return (
      <>
        <Typography.Title>
          {this.props.name}
        </Typography.Title>
        {this.props.children}
      </>
    )
  }
}

export default MenuShow
