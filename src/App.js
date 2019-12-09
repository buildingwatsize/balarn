import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import './App.css';
import MainLayout from './components/layout'
import NotFound from './components/utils/NotFound'

const Main = () => ("Main")
const SignIn = () => ("SignIn")
const SignUp = () => ("SignUp")

export class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/main" component={MainLayout} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default App
