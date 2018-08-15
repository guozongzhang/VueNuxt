import API from '~/plugins/axios'
import storage from '~/plugins/storage'
let Cookies = require('js-cookie')
let pageObj = require('../lib/page.js')
let _ = require('underscore')

export default function ({store, redirect, route}) {
  if (route.path === '/') {
    return redirect('/home')
  }
  // 登录页面直接返回
  if (route.path === '/login/login') {
    return
  }
  // 错误页面直接返回
  if (route.path === '/error/404' || route.path === '/error/error') {
    return
  }
  // 判断是否为同一个页面的不同请求，不重复身份验证请求
  let preurl = storage.get('pre_url')
  if (route.path == preurl && !_.isEmpty(Cookies.get('token-' + process.env.port))) {
    return
  } else {
    storage.set('pre_url', route.path)
  }
  // 判断页面是否存在
  let pathurl = String(route.path + '/index').split('/')
  let pageurl = pathurl[1] + '/' + pathurl[2]
  if (!_.isEmpty(pageObj[pageurl])) {
      // 设置缓存 正常进入
    API.GET('admin/current').then((msg) => {
      // 更新缓存localstorage
      storage.set('dpjuserinfo', msg.data)
      let pagePower = pageObj[pageurl].power
      let powers = msg.data ? ((msg.data.role_id_poi_role || {}).visitor_scope || '').split(',') : []
      if (powers.indexOf(pagePower) > -1) {
        // 设置缓存 正常进入
      } else {
        // 没有权限
        store.$router.push({ path: '/error/error' })
      }
    }, () => {
      store.$router.push({path: '/login/login?return_url=' + route.fullPath})
      return
    })
  } else {
    // 找不到页面
    return redirect('/error/404')
  }
}
