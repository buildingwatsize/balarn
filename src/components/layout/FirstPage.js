import React, { Component } from 'react'
import { Row, Col } from 'antd';
import Signin from '../content/Signin';
import Signup from '../content/Signup';

export class FirstPage extends Component {
  state = {
    mode: "signin"
  }

  changeToMode = (mode) => () => {
    this.setState({ mode })
  }

  componentDidMount = () => {
    if (this.props.history.location.pathname === "/signin" || this.props.history.location.pathname === "/signup") {
      this.setState({mode: this.props.history.location.pathname.substr(1, this.props.history.location.pathname.length)})
    }
  }
  

  render() {
    return (
      <Row type="flex" justify="center" align="middle">
        <Col xs={20} md={12} className="justifyCenter fullMinHeight">
          {this.state.mode === "signin" ? <Signin onChangeMode={this.changeToMode} /> : <Signup onChangeMode={this.changeToMode} />}
        </Col>
      </Row>
    )
  }
}

export default FirstPage
