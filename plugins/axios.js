import axios from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'
let ENV = require('../config/local_env.json')
const API = {}

function getHeaders () {
  let headersobj = {
    'X-DP-Key': ENV.KEY || 'hahha',
    'X-DP-ID': ENV.ID || '222'
  }
  let token = Cookies.get('token-' + process.env.port) || ''
  if (token) {
    headersobj['X-DP-Token'] = token || Cookies.get('token-' + process.env.port)
  }
  return axios.create({
    baseURL: process.env.baseUrl,
    headers: headersobj
  })
}

// axios的get请求方式
// 2018-06-07 yuguo
// url(string)请求url地址，params(object)请求对象
API.GET = function (url, params) {
  return getHeaders().get(url, {params: params})
}

// axios的post请求方式
// 2018-06-07 yuguo
// url(string)请求url地址，params(object)请求对象
API.POST = function (url, params) {
  return getHeaders().post(url, params)
}

// axios的put请求方式
// 2018-06-07 yuguo
// url(string)请求url地址，params(object)请求对象
API.PUT = function (url, params) {
  return getHeaders().put(url, params)
}

// axios的delete请求方式
// 2018-06-07 yuguo
// url(string)请求url地址，params(object)请求对象
API.DELETE = function (url, params) {
  return getHeaders().delete(url, {data: qs.stringify(params)})
}

export default API
