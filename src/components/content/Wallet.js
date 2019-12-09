import React, { Component } from 'react'
import { Typography } from 'antd'

class Wallet extends Component {
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

export default Wallet
