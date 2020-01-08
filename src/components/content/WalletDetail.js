import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Typography, Input, Row, Col, Button, Table, Tag, Statistic, Select, message, Form, Tooltip, Dropdown, Menu, Modal, Icon } from 'antd'

import { b64, withCommas, } from '../../utils'
import Axios from '../../config/api.service'
import moment from 'moment'
import { actions as walletAction } from '../../redux/reducers/wallet'
import { withRouter } from 'react-router-dom'
import AddNewWallet from '../drawer/AddNewWallet'

const { OptGroup, Option } = Select
const { confirm } = Modal

class WalletDetail extends Component {
  state = {
    amount: 0.0,
    mode: "deposit",
    nameEdited: "",
    oldNameWallet: this.props.name,
    isEditName: false,
    modeList: [
      { name: "deposit", type: "increment" },
      { name: "interest", type: "increment" },
      { name: "withdraw", type: "decrement" },
      { name: "transfer", type: "decrement" },
      { name: "pay", type: "decrement" },
    ],
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: (text, _, index) => {
          let color = 'green';
          let foundType = this.state.modeList.find(item => item.name === text)
          if (foundType.type === "decrement") {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={index}>
              {text.toUpperCase()}
            </Tag>
          );
        }
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (text) => {
          return `${withCommas(text.toFixed(2))} THB`
        }
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        render: (text) => {
          return `${withCommas(text.toFixed(2))} THB`
        }
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => (
          <Tooltip placement="top" title={<span>{moment(text).format("ddd, DD MMMM YYYY HH:mm:ss")}</span>}>
            <span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>
          </Tooltip>
        )
      },
      // {
      //   title: 'Action',
      //   key: 'action',
      //   render: (_, record) => (
      //     <span>
      //       <a onClick={this.handleDelete(record.id)} style={{ color: "crimson" }}>Delete</a>
      //     </span>
      //   ),
      // },
    ],
    dataSource: [],
    balance: 0.0,
    addDrawerVisible: false
  }

  setDefaultAmount = () => {
    this.setState({ amount: 0.0 })
    this.props.form.setFieldsValue({
      amount: ""
    });
  }

  decodePathname = () => {
    let wallet_detail = this.props.history.location.pathname.split("/").pop()
    let wallet_detail_decoded = b64.urlDecode(wallet_detail).split("|")
    const [wallet_id] = wallet_detail_decoded
    this.setState({
      currentWallet: wallet_id
    })
  }

  enableEditName = () => {
    this.setState({
      isEditName: true,
    })
  }

  handleChangeName = (e) => {
    this.setState({ nameEdited: e.target.value })
  }

  handleChange = (amount) => {
    this.setState({ amount })
  }

  handleClickSaveEdit = (e) => {
    console.log(e)
    this.editWalletName()
  }

  handleClickCancelEdit = (e) => {
    this.setState((state) => ({
      isEditName: false,
      nameEdited: state.oldNameWallet
    }))
  }

  handleSubmitEnter = (e) => {
    // console.log(e.key);
    if (e.key === "Enter") {
      this.handleSubmit(e)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values);
        this.setState(() => ({
          amount: values.amount
        }), () => {
          this.addTransaction()
        })
      }
    });
  }

  handleSelectMode = (mode) => {
    this.setState({ mode })
  }

  handleDelete = (id) => (e) => {
    console.log(id);
  }

  showAddWalletDrawer = () => {
    console.log("object")
    this.setState({
      addDrawerVisible: true
    })
  }

  hideAddWalletDrawer = () => {
    console.log("object")
    this.setState({
      addDrawerVisible: false
    })
  }

  addWallet = (values) => {
    console.log("object", values)
    Axios.post(`/wallet`, values)
      .then(result => {
        console.log(result.data)
        message.success("Added Wallet")
        this.props.setFlagUpdateWallet()
        this.hideAddWalletDrawer()
      }).catch(err => {
        // err.response.status
        console.error(err)
        message.error("Please try again later")
      })
  }

  editWalletName = () => {
    if (this.state.nameEdited) {
      Axios.put(`/wallet`, {
        "id": this.props.id,
        "name": this.state.nameEdited,
      })
        .then(result => {
          console.log(result.data)
          message.success("Edit Success")
          this.setState((state) => ({
            isEditName: false,
            oldNameWallet: state.nameEdited
          }))
          this.props.setFlagUpdateWallet()
        }).catch(err => {
          // err.response.status
          console.error(err)
          // message.error("Please try again later")
          message.error(err.response.data.message)
        })
    } else {
      message.error("Wallet name cannot be empty.")
    }
  }

  addTransaction = () => {
    Axios.post(`/transaction`, {
      "type": this.state.mode,
      "amount": this.state.amount,
      "wallet_id": this.props.id
    })
      .then(result => {
        console.log(result.data)
        message.success("Added Transaction")
        this.setDefaultAmount()
        this.getTransaction()
      }).catch(err => {
        // err.response.status
        console.error(err)
        message.error("Please try again later")
      })
  }

  clearAllTransaction = () => {
    let me = this
    confirm({
      title: 'Are you sure you want to permanently delete all of transactions?',
      content: 'AWARE! YOU CANNOT UNDO THIS PROCESS.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Oops! No Cancel',
      onOk() {
        Axios.delete(`/transaction/all`, {
          data: {
            "wallet_id": me.props.id
          }
        })
          .then(result => {
            console.log(result.data)
            message.success("Cleared All Transaction")
            me.getTransaction()
          }).catch(err => {
            // err.response.status
            console.error(err)
            message.error("Please try again later")
          })
      },
      onCancel() {
        message.info("Cancelled")
      },
    })
  }

  deleteWallet = () => {
    let me = this
    confirm({
      title: 'Are you sure you want to permanently delete this wallet?',
      content: 'Once you delete a wallet, there is no going back. Please be certain.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Oops! No Cancel',
      onOk() {
        Axios.delete(`/wallet`, {
          data: {
            "id": me.props.id
          }
        })
          .then(result => {
            console.log(result.data)
            message.success("Deleted")
            me.props.setFlagUpdateWallet()
            me.props.history.push("/main")
          }).catch(err => {
            // err.response.status
            console.error(err)
            message.error("Please try again later")
          })
      },
      onCancel() {
        message.info("Cancelled")
      },
    })
  }

  getTransaction = () => {
    Axios.get(`/transaction/${this.props.id}`)
      .then(result => {
        // console.log(result.data)
        this.setState({
          dataSource: result.data,
          balance: result.data.length ? result.data[0].balance : 0.0
        })
      }).catch(err => {
        // err.response.status
        console.error(err)
      })
  }

  setDefaultWalletName = () => {
    this.setState({
      nameEdited: this.props.name
    })
  }

  componentDidMount = () => {
    this.getTransaction()
    this.setDefaultWalletName()
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const moreMenuDropdown = (
      <Menu>
        {this.props.role === "premium" ?
          <Menu.Item key="add" onClick={() => this.showAddWalletDrawer()}>
            <span><Icon type="plus-circle" /> Add New Wallet</span>
          </Menu.Item>
          : ""
        }
        <Menu.Item key="rename" onClick={this.enableEditName}>
          <span><Icon type="edit" /> Rename Wallet</span>
        </Menu.Item>
        <Menu.Item key="refresh" onClick={() => this.getTransaction()}>
          <span><Icon type="reload" /> Refresh Wallet</span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="delete" style={{ backgroundColor: "crimson" }} onClick={() => this.clearAllTransaction()}>
          <span style={{ color: "whitesmoke" }}><Icon type="delete" /> Clear Wallet Transactions</span>
        </Menu.Item>
        {this.props.numberOfWallet !== 1 ?
          <Menu.Item key="deleteWallet" style={{ backgroundColor: "crimson", marginTop: "4px" }} onClick={() => this.deleteWallet()}>
            <span style={{ color: "whitesmoke" }}><Icon type="delete" /> Delete Wallet</span>
          </Menu.Item>
          : ""
        }
      </Menu>
    )

    return (
      <>
        <Row type="flex" justify="space-between">
          <Col>
            {this.state.isEditName ?
              <Row type="flex" gutter={8} style={{ marginBottom: "1em" }}>
                <Col>
                  <Input size="large" placeholder={this.props.name} value={this.state.nameEdited} onChange={this.handleChangeName} />
                </Col>
                <Col>
                  <Button icon="save" shape="circle" type="primary" onClick={this.handleClickSaveEdit} />
                </Col>
                <Col>
                  <Button icon="close" shape="circle" type="danger" onClick={this.handleClickCancelEdit} />
                </Col>
              </Row>
              :
              <Typography.Title>
                {this.state.nameEdited}
              </Typography.Title>
            }
          </Col>
          <Col>
            <Dropdown overlay={moreMenuDropdown} trigger={['click']}>
              <Button icon="more" type="ghost">More</Button>
            </Dropdown>
          </Col>
        </Row>

        <Row gutter={8} className="" type="flex" justify="space-between">
          <Col>
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <Row type="flex">
                <Col>
                  <Form.Item>
                    {getFieldDecorator('amount', {
                      rules: [
                        {
                          validator: (rule, value, callback) => {
                            if (value > 0) {
                              callback();
                            } else {
                              callback('Price must greater than zero!');
                            }
                          }
                        }
                      ],
                    })(
                      <Input
                        type="number"
                        style={{ width: "100%" }}
                        addonAfter="THB"
                        onKeyDown={this.handleSubmitEnter}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Select defaultValue={this.state.modeList[0].name} style={{ width: 120 }} onChange={this.handleSelectMode}>
                      <OptGroup label="Increment">
                        {this.state.modeList.filter(item => item.type === "increment").map((item) => {
                          return <Option key={item.name} value={item.name}>{item.name.toUpperCase()}</Option>
                        })}
                      </OptGroup>
                      <OptGroup label="Decrement">
                        {this.state.modeList.filter(item => item.type === "decrement").map((item) => {
                          return <Option key={item.name} value={item.name}>{item.name.toUpperCase()}</Option>
                        })}
                      </OptGroup>
                    </Select>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button block type="primary" htmlType="submit">Save It!</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col style={{ textAlign: "end" }}>
            <Statistic title="Account Balance (THB)" value={this.state.balance} precision={2} />
          </Col>
        </Row>

        <Row style={{ marginTop: "2em" }}>
          <Col xs={24}>
            <Table
              rowKey={"id"}
              dataSource={this.state.dataSource}
              columns={this.state.columns}
            />
          </Col>
        </Row>

        {/* DRAWER */}
        <AddNewWallet visible={this.state.addDrawerVisible} onSave={this.addWallet} onClose={this.hideAddWalletDrawer} />


        {/* {this.props.children} */}
      </>
    )
  }
}

const mapStateToProps = ({ auth, wallet }) => ({
  role: auth.role,
  numberOfWallet: wallet.numberOfWallet
})

const mapDispatchToProps = {
  ...walletAction
}

const WrappedWalletDetail = withRouter(Form.create({ name: 'control_input_number' })(WalletDetail))
export default connect(mapStateToProps, mapDispatchToProps)(WrappedWalletDetail)

