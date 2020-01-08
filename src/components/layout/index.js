import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { Layout, Menu, Icon, Row, Col, Button, Divider, Popover, Drawer } from 'antd'
import WalletDetail from '../content/WalletDetail';
import MenuDetail from '../content/MenuDetail';
import Settings from '../content/Settings';
import Feedback from '../content/Feedback';
import Help from '../content/Help';
import { TOKEN } from '../../config/constants'

import Axios from '../../config/api.service'
import { actions as authAction } from '../../redux/reducers/auth'
import { actions as walletAction } from '../../redux/reducers/wallet'
import { parseJwt, b64 } from '../../utils';
import EmptyDetail from '../content/EmptyDetail';
import { ManageUser } from '../content/ManageUser';

const { SubMenu } = Menu;
const { Content, Sider } = Layout

const PremiumBadge = (username, role) => {
  const maxChar = 11
  let isLongTag = username.length > maxChar
  username = isLongTag ? `${username.slice(0, maxChar)}...` : username

  let color = {
    color: "#f5222d",
    background: "#fff1f000",
    borderColor: "#f5222d"
  }
  if (role && role.toLowerCase() === "free") {
    color = {
      color: "#729B79",
      background: "#fcffe600",
      borderColor: "#729B79"
    }
  } else if (role && role.toLowerCase() === "premium") {
    color = {
      color: "#faad14",
      background: "#fffbe600",
      borderColor: "#faad14"
    }
  } else if (role && role.toLowerCase() === "admin") {
    color = {
      color: "#85DBDB",
      background: "#fffbe600",
      borderColor: "#85DBDB"
    }
  }

  return (
    <Button.Group size="small">
      <Button style={{ ...color, color: "#001529", background: color.color }}>
        {role && role.toUpperCase()}
      </Button>
      <Button style={color}>
        {username}
      </Button>
    </Button.Group>
  )
}

class MainLayout extends Component {
  state = {
    user_id: -1,
    username: "Guest",
    role: "free", // set free as a default
    currentMenuSelected: "",
    visibleDrawer: false,
    drawerSelected: {
      name: undefined,
      content: undefined
    },
    walletList: [],
    middleMenu: [
      { id: "menu-0", name: "Menu 1", icon: "setting", children: "", isActive: false },
      { id: "menu-1", name: "Menu 2", icon: "setting", children: "", isActive: false },
      { id: "menu-2", name: "Menu 3", icon: "setting", children: "", isActive: false },
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
        let key = e.key.split("-")
        item.isActive = key[0] === "wallet" ? `${item.id}` === key[1] : false
        return true
      }),
      middleMenu: state.middleMenu.slice().filter(item => {
        item.isActive = `${item.id}` === e.key
        return true
      })
    }))
  };

  handleClickWallet = (item) => () => {
    this.setState({
      currentMenuSelected: `wallet-${item.id}`
    })
    // localStorage.setItem("swid", b64.urlEncode(item.id))
    // console.log([item.id, this.state.user_id, this.state.username].join("|"));
    this.props.history.push(`/main/${b64.urlEncode([item.id, this.state.user_id, this.state.username].join("|"))}`)
  }
  
  handleClickMiddleMenu = (item) => () => {
    let menuId = `${item.id}`
    this.setState({
      currentMenuSelected: menuId
    })
    // localStorage.setItem("swid", b64.urlEncode(item.id))
    // console.log([item.id, this.state.user_id, this.state.username].join("|"));
    this.props.history.push(`/main/${menuId}`)
  }

  handleClickBottomMenu = (menu) => (e) => {
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
    let isWalletMenuSelected = this.state.walletList.find((item) => item.isActive)
    let isMiddleMenuSelected = this.state.middleMenu.find((item) => item.isActive)
    if (isWalletMenuSelected) {
      return <WalletDetail {...isWalletMenuSelected} />
    } else if (isMiddleMenuSelected) {
      return <MenuDetail {...isMiddleMenuSelected}>
        {isMiddleMenuSelected.children}
      </MenuDetail>
    } else {
      return <EmptyDetail />
    }
  }

  getWallet = () => {
    Axios.get("/wallet")
      .then(result => {
        // console.log(result.data)
        // this.setWallet(result.data)
        let wallet_data_with_active = result.data.slice().filter(item => {
          item.isActive = `${item.id}` === `${this.state.currentMenuSelected.split("-").pop()}`
          return true
        })
        this.setState({
          walletList: wallet_data_with_active
        })
        this.props.setNumberOfWallet(wallet_data_with_active.length)
      }).catch(err => {
        // err.response.status
        console.error(err)
      })
  }

  getUserDetail = () => {
    const data = parseJwt(sessionStorage.getItem(TOKEN))
    this.setState({
      user_id: data.id,
      username: data.username,
      role: data.role
    })
  }

  setActiveMenu = () => {
    let wallet_detail = this.props.history.location.pathname.split("/").pop()
    let setCurrentMenu = ""
    if (wallet_detail.includes("menu")) {
      setCurrentMenu = wallet_detail
    } else {
      let wallet_detail_decoded = b64.urlDecode(wallet_detail).split("|")
      const [wallet_id] = wallet_detail_decoded
      setCurrentMenu = "wallet-" + wallet_id
    }
    this.setState({
      currentMenuSelected: setCurrentMenu
    })
  }

  componentDidMount = () => {
    if (!sessionStorage.getItem(TOKEN)) {
      this.props.history.push("/")
    } else {
      this.setActiveMenu()
      this.getWallet()
      this.getUserDetail()
      this.setState((state) => ({
        middleMenu: this.props.role === "admin" ? [{ id: "menu-user-mgmt", name: "User Management", icon: "setting", children: <ManageUser />, isActive: false }, ...state.middleMenu] : state.middleMenu
      }))
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.role !== this.props.role || this.props.role === "guest") {
      window.appHistory.push("/")
    }
    if (prevProps.flagEventEditWalletName !== this.props.flagEventEditWalletName) {
      this.getWallet()
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
              selectedKeys={[this.state.currentMenuSelected]}
              style={{ height: '100%', borderRight: 0 }}
            >
              <div>
                <Link to="/main" className="justifyCenter"><img src="/OwlsomeLogo.png" height="64" alt="logo" /></Link>
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
                  <Menu.Item key={"wallet-" + item.id} onClick={this.handleClickWallet(item)}>{item.name}</Menu.Item>
                ))}
              </SubMenu>
              {this.state.middleMenu.map(item => (
                <Menu.Item key={item.id} onClick={this.handleClickMiddleMenu(item)}>
                  <span>
                    <Icon type={item.icon} />
                    {item.name}
                  </span>
                </Menu.Item>
              ))}
              <div key="premium" className="siderPremiumBadgeFooter">
                {PremiumBadge(this.state.username, this.state.role)}
              </div>
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

const mapStateToProps = ({ auth, wallet }) => ({
  role: auth.role,
  flagEventEditWalletName: wallet.flagEventEditWalletName
})

const mapDispatchToProps = {
  ...authAction,
  ...walletAction
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout)

