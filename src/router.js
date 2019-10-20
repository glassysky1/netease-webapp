import Vue from 'vue'
import Router from 'vue-router'
import Recommend from "components/recommend/recommend";
import Singer from "components/singer/singer";
import Search from "components/search/search";
import SingerDetail from "components/singer-detail/singer-detail.vue";
import Disc from "components/disc/disc";
import Toplist from "components/toplist/toplist";
import Login from "components/login/login";
import LikeList from "components/like-list/like-list";
Vue.use(Router)

export default new Router({
  mode:"hash",
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search
    },
    {
      path:'/toplist',
      component:Toplist,
      children:[
        {
          path:':id',
          component:Disc
        }
      ]
    },
    {
      path:'/login',
      component: Login
    },
    {
      path:'/likelist',
      component: LikeList
    }
  ]
})
