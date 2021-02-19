import React from 'react'
import { Router } from 'dva/router'
import dynamic from './commom/utils/dynamic'
import renderRoutes from './commom/utils/renderRoutes'

// dynamic.setDefaultLoadingComponent(require('./components/PageLoading').default)

export default rawRoutes => ({ history, app }) => {
  const routes = [
    {
      path: '/',
      redirect: '/home',
      exact: true
    },
    {
      path: '/',
      component: dynamic({
        component: () => import('./pages/wrapper')
      }),
      routes: [
        { path: '/home', exact: true, component: require('./pages/homePage').default },
        { path: '/createCode', exact: true, component: require('./pages/createCode').default },
        { path: '*', component: require('./pages/notFound').default}
      ]
    }
  ]

  return (
    <Router history={history} basename='/codeMaster'>
      {renderRoutes(routes)}
    </Router>
  )
}
