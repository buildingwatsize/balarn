import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Row, Col } from 'antd';
import Signin from '../content/Signin';
import Signup from '../content/Signup';
import { TOKEN } from '../../config/constants';

import { actions as authAction } from '../../redux/reducers/auth'

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
    const token = sessionStorage.getItem(TOKEN);
    if (!token) {
      this.props.setRole("guest")
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

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  ...authAction
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstPage)
