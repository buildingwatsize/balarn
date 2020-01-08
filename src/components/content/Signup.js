import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Avatar, Typography, Input, Form, Icon, Button, message } from 'antd';

import Axios from '../../config/api.service'

export class Signup extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.signUp(values.username, values.password, values.remember)
      }
    });
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  signUp = (username, password, remember) => {
    Axios.post("/signup", { username, password })
      .then(result => {
        // console.log(result.data)
        message.success(result.data.message)
        window.appHistory.push("/signin")
        this.props.onChangeMode("signin")() // redirect trick :D 
      }).catch(err => {
        // err.response.status
        // console.error(err)
        message.error(err.response.data.message || "Please try again later")
      })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Card id="signin-signup-form">
        <Avatar src="OwlsomeLogo2.png" shape="square" size={200} />
        <Typography.Title level={2} className="textCenter">Sign Up</Typography.Title>
        <Form onSubmit={this.handleSubmit} className="signin-signup-form">
          {/* <Form.Item hasFeedback>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
              />,
            )}
          </Form.Item> */}
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
          <Form.Item hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Please input your password!" />)}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Please confirm your password!" onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          <Form.Item>
            {/* {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: false,
            })(<Checkbox className="signin-signup-form-remember">Remember me</Checkbox>)}

            <Link to="/" className="signin-signup-form-forgot">
              Forgot password
            </Link> */}

            <Button type="primary" htmlType="submit" className="signin-signup-form-button">
              Sign up
            </Button>

            Or <Link to="/signin" onClick={this.props.onChangeMode("signin")}>Back to Sign in!</Link>

          </Form.Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create({ name: 'signup' })(Signup)
