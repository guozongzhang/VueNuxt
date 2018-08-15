<template lang="pug">
  section.dpjia-content-header(v-if="page.name")
    h1
      span {{page.name}}
      a.back(href="javascript:;" @click="goBack()" v-if="page.back") <<返回列表 {{messageGy}}
      nuxt-link.back(:to="page.back" v-if="false") 
    ol.breadcrumb-list
      li
        nuxt-link(to="/home")
          i.fa.fa-dashboard
          | Home
      li.cru(v-if="page.breadcrumb" v-for="val in page.breadcrumb")
        nuxt-link.back-link(:to="val[1]" v-if="val[1]") {{val[0]}}
        span(v-else) {{val[0]}}
          
      li.cru.active {{page.name}}
</template>
<script>
  let url = require('url')
  let model
  let pageArr = require('../../lib/page.js')
  export default {
    data () {
      return {
        page: {}
      }
    },
    watch: {
      '$route': function () {
        this.init()
      }
    },
    methods: {
      init: function () {
        let path = String((url.parse(window.location.href)).pathname + '/index').split('/')
        let pathurl = path[1] + '/' + path[2]
        model.page = pageArr[pathurl]
      },

      // 返回上一级
      // 2018-07-05 yuguo
      goBack: function () {
        window.history.back(-1)
      }
    },
    mounted () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
  .dpjia-content-header {
    padding: 10px 15px;
    h1{
      height: 32px;
      line-height: 32px;
      margin: 0;
      span{
        font-size: 24px;
        font-weight: 500;
      }
    }
    .breadcrumb-list{
      float: right;
      background: 0 0;
      margin-top: 0;
      margin-bottom: 0;
      font-size: 12px;
      padding: 7px 5px;
      position: absolute;
      top: 15px;
      right: 10px;
      border-radius: 2px;
      li{
        display: inline-block;
        margin-right: 5px;
        .fa-dashboard {
          margin-right: 2px;
        }
      }
      li.cru:before {
        padding: 0 5px;
        color: #ccc;
        content: '>\00a0';
      }
    }
    .back{
      margin-left: 20px;
      font-size: 12px;
      color: #45aaf2;
      font-weight: 400;
    }
  }
</style>
