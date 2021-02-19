import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

export default function renderRoutes (
  routes,
  extraProps = {},
  switchProps = {}
) {
  // eslint-disable-next-line no-extra-parens
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => {
        if (route.redirect) {
          return (
            <Redirect
              key={route.key || i}
              from={route.path}
              to={route.redirect}
              exact={route.exact}
              strict={route.strict}
            />
          )
        }

        return (
          <Route
            key={route.key || i}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={props => {
              const childRoutes = renderRoutes(
                route.routes,
                {}, // extraProps
                { location: props.location } //switchProps
              )
              if (route.component) {
                return (
                  <route.component
                    {...props}
                    {...extraProps}
                    route={route}
                  >
                    {childRoutes}
                  </route.component>
                )
              } else {
                return childRoutes
              }
            }}
          />
        )
      })}
    </Switch>
  ) : null
}
