import "isofw-shared/src/xpfwDefs"

import url from "isofw-shared/src/globals/url"
import Home from "isofw-web/src/pages/home"
import {
  LoadableAboutPage, LoadableCreateLocalMatch, LoadableCreatePage, LoadableEditPage,
  LoadableExpertOverview, LoadableListPage,
  LoadableLocalGameDetail, LoadableLocalGameHistory,
  LoadableLoginPage,
  LoadableNewOnlineMatch, LoadableOnlineDashboard, LoadableOnlineGameDetail,
  LoadableOnlineMatchHistory, LoadableOnlineMatchOverview, LoadableSettings
} from "isofw-web/src/pages/loadables"
import * as React from "react"
import pose, { PoseGroup } from "react-pose"
import { HashRouter, Link, Route, Switch } from "react-router-dom"
const duration = 8000
const RouteContainer = pose.div({
  enter: {
    opacity: 1, beforeChildren: true, transition: {duration}
  },
  exit: { opacity: 0, transition: {duration}}
})

const AppRouter = () => (
  <HashRouter>
    <Route
      render={({ location }) => (
        <Switch location={location}>
          <Route exact={true} path="/" component={LoadableCreateLocalMatch} key="home" />
          {/* <Route path={url.local} component={LoadableCreateLocalMatch} key={url.local} /> */}
          <Route
            path={`${url.localMatchHistory}/:id`}
            component={LoadableLocalGameHistory}
            key={url.localMatchHistory}
          />
          <Route
            path={`${url.localMatchDetail}/:id`}
            component={LoadableLocalGameDetail}
            key={url.localMatchDetail}
          />
          <Route path="/about" component={LoadableAboutPage} key="about" />
          <Route path={url.settings} component={LoadableSettings} key={url.settings} />
          {/* <Route path="/login" component={LoadableLoginPage} key="login" />
          <Route path={url.newMatch} component={LoadableNewOnlineMatch} key={url.newMatch} />
          <Route
            path={url.onlineMatchOverview}
            component={LoadableOnlineMatchOverview}
            key={url.onlineMatchOverview}
          />
          <Route
            path={`${url.onlineMatchDetail}/:id`}
            component={LoadableOnlineGameDetail}
            key={url.onlineMatchDetail}
          />
          <Route
            path={`${url.onlineMatchHistory}/:id`}
            component={LoadableOnlineMatchHistory}
            key={url.onlineMatchHistory}
          />
          <Route
            path={`${url.expertOverview}`}
            component={LoadableExpertOverview}
            key={url.expertOverview}
          />
          <Route path={url.online} component={LoadableOnlineDashboard} key={url.online} />
          
          <Route path="/create/:collection" component={LoadableCreatePage} key="create" />
          <Route path="/list/:collection" component={LoadableListPage} key="list" />
          <Route path="/edit/:collection/:id" component={LoadableEditPage} key="about" /> */}
        </Switch>
      )}
    />
  </HashRouter>
)

export default AppRouter
