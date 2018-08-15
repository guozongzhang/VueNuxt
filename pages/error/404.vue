<template lang="pug">
  div.con-box
    div.error-box
      img(src="/images/404.gif")
      img(src="/images/404.png")
      p 找不到页面
        a(href="javascript:;" @click="goback()") &nbsp;&nbsp;返回上一级页面
</template>
<script>
  let model
  import storage from '~/plugins/storage'
  import AppLogo from '~/components/home/AppLogo.vue'
  export default {
    head () {
      return {
        title: '错误'
      }
    },
    data () {
      return {}
    },
    layout: 'layout',
    methods: {
      // 初始化数据
      // 2018-06-21 yuguo
      init: function () {
        
      },

      // 返回上一级
      // 2018-06-21 yuguo
      goback: function () {
        window.history.go(-1)
      }
    },
    mounted () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
  .error-box{
    width: 400px;
    margin: 0 auto;
  }
  .error-box img{
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }
  p{
    margin: 20px 0;
    font-size: 16px;
    text-align: center;
  }
</style>
