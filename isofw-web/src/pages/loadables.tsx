import LoadingPage from "isofw-web/src/components/loading"
import * as Loadable from "react-loadable"

const LoadableAboutPage = Loadable({
  loading: LoadingPage,
  loader: () => import("./about")
})

const LoadableCreatePage = Loadable({
  loading: LoadingPage,
  loader: () => import("./collections/create")
})

const LoadableEditPage = Loadable({
  loading: LoadingPage,
  loader: () => import("./collections/edit")
})

const LoadableListPage = Loadable({
  loading: LoadingPage,
  loader: () => import("./collections/list")
})

const LoadableLoginPage = Loadable({
  loading: LoadingPage,
  loader: () => import("./login")
})

const LoadableSettings = Loadable({
  loading: LoadingPage,
  loader: () => import("./settings")
})

const LoadableCreateLocalMatch = Loadable({
  loading: LoadingPage,
  loader: () => import("./local/create")
})

const LoadableOnlineDashboard = Loadable({
  loading: LoadingPage,
  loader: () => import("./online")
})

const LoadableOnlineMatchOverview = Loadable({
  loading: LoadingPage,
  loader: () => import("./online/overview")
})

const LoadableExpertOverview = Loadable({
  loading: LoadingPage,
  loader: () => import("./online/expertPlayOverview")
})

const LoadableOnlineMatchHistory = Loadable({
  loading: LoadingPage,
  loader: () => import("./online/history")
})


const LoadableNewOnlineMatch = Loadable({
  loading: LoadingPage,
  loader: () => import("./online/newMatch")
})

const LoadableOnlineGameDetail = Loadable({
  loading: LoadingPage,
  loader: () => import("./online/game")
})

const LoadableLocalGameDetail = Loadable({
  loading: LoadingPage,
  loader: () => import("./local/game")
})

const LoadableLocalGameHistory = Loadable({
  loading: LoadingPage,
  loader: () => import("./local/history")
})

export {
  LoadableAboutPage, LoadableCreatePage, LoadableEditPage, LoadableListPage,
  LoadableLoginPage, LoadableNewOnlineMatch, LoadableLocalGameHistory,
  LoadableSettings, LoadableCreateLocalMatch, LoadableOnlineDashboard,
  LoadableOnlineMatchOverview, LoadableOnlineGameDetail, LoadableLocalGameDetail,
  LoadableOnlineMatchHistory, LoadableExpertOverview
}
