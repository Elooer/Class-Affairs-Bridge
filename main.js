// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 导入sotre实例对象
import store from './store/store.js'
// 导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'

uni.$http = $http

// 请求的根路径
// http://43.138.133.249:5523
// https://www.lapichang.top
$http.baseUrl = 'https://www.lapichang.top'

// 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  // 将store挂载到Vue实例上
  store,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
