import React, { Component } from 'react'
import { Drawer, Form, Col, Button, Row, Input } from 'antd'

class AddNewWallet extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSave(values)
      }
    });
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Drawer
        title="Create a new wallet"
        // width={300}
        onClose={this.props.onClose}
        visible={this.props.visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" hideRequiredMark>
          <Row>
            <Col span={24}>
              <Form.Item label="Wallet Name">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please enter a wallet name' }],
                })(<Input placeholder="Please enter a wallet name" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} type="primary">
            Submit
          </Button>
        </div>
      </Drawer>
    )
  }
}

const WrappedAddNewWallet = Form.create({ name: 'add_new_wallet' })(AddNewWallet)
export default WrappedAddNewWallet
