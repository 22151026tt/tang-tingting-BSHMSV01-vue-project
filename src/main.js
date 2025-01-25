import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//CSSを導入する
import '@/assets/css/global.css'
//Element-plusコンポーネントを導入する
import ElementPlus from 'element-plus'
//Element-plus関連のスタイルを導入する
import 'element-plus/dist/index.css'
//国際化に必要なコンポーネントを導入する
import ja from 'element-plus/es/locale/lang/ja'

//ElementPlusIconsVueを導入する
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
createApp(App).use(store).use(router).use(ElementPlus, {locale: ja,}).mount('#app')
