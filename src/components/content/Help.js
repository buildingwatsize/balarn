import React, { Component } from 'react'
import { Typography } from 'antd'

class Help extends Component {
  render() {
    return (
      <>
        <Typography.Title level={4}>
          If you found bugs or wanna tell me something, send me email to <a href="mailto:chinnawat.cpre@gmail.com">chinnawat.cpre@gmail.com</a>.
        </Typography.Title>
      </>
    )
  }
}

export default Help
