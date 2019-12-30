import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card, Avatar, Typography, Input, Form, Icon, Button, Checkbox, message } from 'antd';

import Axios from '../../config/api.service'
import { actions as authAction } from '../../redux/reducers/auth'

export class Signin extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.signIn(values.username, values.password, values.remember)
      }
    });
  }

  signIn = (username, password, remember) => {
    Axios.post("/signin", { username, password })
      .then(result => {
        // console.log(result.data)
        this.props.signin(result.data.token)
      }).catch(err => {
        // err.response.status
        console.error(err)
      })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.role !== this.props.role) {
      // Found user not a guest
      window.appHistory.push("/main")
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Card id="signin-form">
        <Avatar src="OwlsomeLogo2.png" shape="square" size={200} />
        <Typography.Title level={2} className="textCenter">Sign In</Typography.Title>
        <Form onSubmit={this.handleSubmit} className="signin-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input.Password
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: false,
            })(<Checkbox className="signin-form-remember">Remember me</Checkbox>)}

            <Link to="/" className="signin-form-forgot">
              Forgot password
            </Link>

            <Button type="primary" htmlType="submit" className="signin-form-button">
              Sign in
            </Button>

            Or <Link to="/signup" onClick={this.props.onChangeMode("signup")}>register now!</Link>

          </Form.Item>
        </Form>
      </Card>
    )
  }
}

const mapStateToProps = ({ auth }) => ({
  role: auth.role
})

const mapDispatchToProps = {
  ...authAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'signin' })(Signin))
