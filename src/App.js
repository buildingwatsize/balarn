import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'

import './App.css';
import MainLayout from './components/layout'
import FirstPage from './components/layout/FirstPage'
import NotFound from './components/utils/NotFound'

export class App extends Component {
  render() {
    window.appHistory = this.props.history
    return (
      <Switch>
        <Route exact path="/" component={FirstPage} />
        <Route path="/main" component={MainLayout} />
        <Route path="/signin" component={FirstPage} />
        <Route path="/signup" component={FirstPage} />
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default withRouter(App)
