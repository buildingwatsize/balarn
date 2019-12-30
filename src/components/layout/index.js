import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { Layout, Menu, Icon, Row, Col, Button, Divider, Popover, Drawer } from 'antd'
import Wallet from '../content/Wallet';
import MenuShow from '../content/MenuShow';
import Settings from '../content/Settings';
import Feedback from '../content/Feedback';
import Help from '../content/Help';
import { TOKEN } from '../../config/constants'

import Axios from '../../config/api.service'
import { actions as authAction } from '../../redux/reducers/auth'

const { SubMenu } = Menu;
const { Content, Sider } = Layout

class MainLayout extends Component {
  state = {
    currentMenu: "0",
    visibleDrawer: false,
    drawerSelected: {
      name: undefined,
      content: undefined
    },
    walletList: [
      { id: "wallet-0", name: "Wallet Name 1", isActive: false },
      { id: "wallet-1", name: "Wallet Name 2", isActive: false },
      { id: "wallet-2", name: "Wallet Name 3", isActive: false },
      { id: "wallet-3", name: "Wallet Name 4", isActive: false },
    ],
    middleMenu: [
      { id: "menu-0", name: "Menu 1", icon: "setting", isActive: false },
      { id: "menu-1", name: "Menu 2", icon: "setting", isActive: false },
      { id: "menu-2", name: "Menu 3", icon: "setting", isActive: false },
    ],
    bottomMenu: [
      { name: "Settings", icon: "setting" },
      { name: "Feedback", icon: "heart" },
      { name: "Help", icon: "question-circle" },
      { name: "Sign Out", icon: "logout", style: { color: "white" } },
    ]
  }

  handleClick = e => {
    this.setState((state) => ({
      walletList: state.walletList.slice().filter(item => {
        item.isActive = e.key.split("-")[0] === "wallet" ? item.id === e.key : false
        return true
      }),
      middleMenu: state.middleMenu.slice().filter(item => {
        item.isActive = e.key.split("-")[0] === "menu" ? item.id === e.key : false
        return true
      })
    }))
  };

  handleClickBottomMenu = (menu) => (e) => {
    console.log(menu)
    if (menu.name !== "Sign Out") {
      this.setState({
        visibleDrawer: true,
        drawerSelected: {
          name: menu.name,
          content: menu.name === "Settings" ? <Settings /> : menu.name === "Feedback" ? <Feedback /> : <Help />
        }
      })
    } else {
      this.props.signout()
    }
  }

  showDrawer = () => {
    this.setState({
      visibleDrawer: true,
    });
  };

  hideDrawer = () => {
    this.setState({
      visibleDrawer: false,
    });
  };

  getContentAndRender = () => {
    let menuSelected = this.state.walletList.find((item) => item.isActive) || this.state.middleMenu.find((item) => item.isActive)
    return menuSelected ? (menuSelected.id.split("-")[0] === "wallet" && <Wallet {...menuSelected}/>) || (menuSelected.id.split("-")[0] === "menu" && <MenuShow {...menuSelected}/>) : ""
  }

  getWallet = () => {
    Axios.get("/wallet")
      .then(result => {
        console.log(result.data)
        // this.setWallet(result.data)
        this.setState({
          // walletList: [...result.data, { default_item }]
          walletList: [...result.data]
        })
      }).catch(err => {
        // err.response.status
        console.error(err)
      })
  }

  componentDidMount = () => {
    if (!sessionStorage.getItem(TOKEN)) {
      window.appHistory.push("/")
    } else {
      this.getWallet()
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.role !== this.props.role || this.props.role === "guest") {
      window.appHistory.push("/")
    }
  }

  render() {
    return (
      <>
        <Layout className="fullMinHeight">
          <Sider
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
            }}
          >
            <Menu
              theme="dark"
              mode="inline"
              onClick={this.handleClick}
              defaultOpenKeys={['wallets']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <div>
                <Link to="/main" className="justifyCenter"><img src="OwlsomeLogo.png" height="64" alt="logo" /></Link>
              </div>
              <SubMenu
                key="wallets"
                title={
                  <span>
                    <Icon type="wallet" />
                    Wallets
                  </span>
                }
              >
                {this.state.walletList.map(item => (
                  <Menu.Item key={item.id}>{item.name}</Menu.Item>
                ))}
              </SubMenu>
              {this.state.middleMenu.map(item => (
                <Menu.Item key={item.id}>
                  <span>
                    <Icon type={item.icon} />
                    {item.name}
                  </span>
                </Menu.Item>
              ))}
              <div key="more" className="siderFooter">
                <Row>
                  <Divider style={{ margin: 0, backgroundColor: "rgb(80, 91, 102)" }} />
                </Row>
                <Row type="flex">
                  {this.state.bottomMenu.map((item, index) => (
                    <Col span={24 / this.state.bottomMenu.length} key={item.name} className="justifyCenter">
                      <Popover
                        placement={index === 0 ? "topLeft" : (index === this.state.bottomMenu.length - 1 ? "topRight" : "top")}
                        content={item.name}
                        >
                        <Button
                          type={item.style ? "danger" : "link"}
                          size={item.style && "small"}
                          shape="circle"
                          icon={item.icon}
                          style={item.style ? item.style : {}}
                          onClick={this.handleClickBottomMenu(item)}
                          />
                      </Popover>
                    </Col>
                  ))}
                </Row>
              </div>
            </Menu>
          </Sider>
          <Layout style={{ marginLeft: 200, padding: '24px' }}>
            <Content
              style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              {this.getContentAndRender()}
            </Content>
          </Layout>
        </Layout>

        <Drawer
          title={this.state.drawerSelected.name}
          placement="right"
          closable={false}
          onClose={this.hideDrawer}
          visible={this.state.visibleDrawer}
        >
          {this.state.drawerSelected.content}
        </Drawer>
      </>
    )
  }
}

const mapStateToProps = ({ auth }) => ({
  role: auth.role
})

const mapDispatchToProps = {
  ...authAction
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout)

