import React from 'react'
import { Router, Route, Switch } from 'dva/router'
import HomePage from './pages/homePage'

function RouterConfig ({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path='/' exact component={HomePage} />
      </Switch>
    </Router>
  )
}

export default RouterConfig
