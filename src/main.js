// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
window.Promise = Promise;

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import axios from 'axios'
import qs from 'qs';
//import cors from 'cors';


// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})



/*
let bindToGlobal = (obj, key='var') => {
    if (typeof window[key] === 'undefined') {
        window[key] = {};
    }

    for (let i in obj) {
        window[key][i] = obj[i]
    }
}

bindToGlobal(http,'_const'); */


/*
Vue.use(cors,({
   origin: _const.baseUrl,
   credentials: true
}));
*/
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false

Vue.prototype.$qs = qs;

//axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: config.baseUrl,
  timeout: 10000,
  headers: {'content-type': 'application/x-www-form-urlencoded'}
});

Vue.prototype.$ajax = instance



//Vue.prototype.$store = null;

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

Vue.prototype.$baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro



/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
