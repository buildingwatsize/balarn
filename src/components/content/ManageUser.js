import React, { Component } from 'react'
import { connect } from 'react-redux'

import Axios from '../../config/api.service'
import { Col, Row, Table, Tooltip, Tag } from 'antd'
import moment from 'moment'

export class ManageUser extends Component {
  state = {
    userList: [],
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (role, _, index) => {
          let color = "volcano"
          if (role && role.toLowerCase() === "free") {
            color = "green"
          } else if (role && role.toLowerCase() === "premium") {
            color = "gold"
          } else if (role && role.toLowerCase() === "admin") {
            color = "cyan"
          }
          return (
            <Tag color={color} key={index}>
              {role.toUpperCase()}
            </Tag>
          );
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
  }

  getUser = () => {
    Axios.get("/user")
      .then(result => {
        // console.log(result.data)
        this.setState({
          userList: result.data
        })
      }).catch(err => {
        // err.response.status
        console.error(err)
      })
  }

  componentDidMount = () => {
    this.getUser()
  }

  render() {
    return (
      <Row style={{ marginTop: "2em" }}>
        <Col xs={24}>
          <Table
            rowKey={"id"}
            dataSource={this.state.userList}
            columns={this.state.columns}
          />
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUser)
