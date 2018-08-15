import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// window.fetch() 的 Polyfill
require('whatwg-fetch')
const store = () => new Vuex.Store({
  state: {
    authUser: ''
  },
  mutations: {
    // 设置用户token
    SET_USER: function (state, user) {
      state.authUser = user
    }
  },

  actions: {
  }
})

export default store
