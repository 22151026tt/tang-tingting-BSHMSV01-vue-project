import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BukenView from '../views/BukenView.vue'
import KarinushiView from "@/views/KarinushiView";
import KeiyakuView from "@/views/KeiyakuView";
import NyukinView from "@/views/NyukinView";


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/buken',
    name: 'buken',
    component: BukenView
  },
  {
    path: '/karinushi',
    name: 'karinushi',
    component: KarinushiView
  },
  {
    path: "/keiyaku",
    name: "keiyaku",
    component: KeiyakuView
  },
  {
    path: "/nyukin",
    name: "nyukin",
    component: NyukinView
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
