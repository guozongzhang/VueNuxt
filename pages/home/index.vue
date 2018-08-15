<template lang="pug">
  div#welcome(style="position:relative;height:220px;")
    img(src="~static/images/dpjia_logo.png" style="position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%,0);-moz-transform:translate(-50%,0);transform:translate(-50%,0);width:250px;")
    p(style="position:absolute;top:80%;width:100%;text-align:center;font-size:30px;") 欢迎使用搭配家商家管理系统
    p(style="position:absolute;top:120%;width:100%;text-align:center;" v-show="loading")
      i.fa.fa-spinner.fa-pulse.fa-3x.fa-fw
</template>

<script>
  let model
  export default {
    head () {
      return {
        title: '首页'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loading: true
      }
    },
    methods: {
      // 初始化数据
      // 2018-06-02 yuguo
      init: function () {
        model.loading = false
      }
    },
    mounted () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
  .con-box{
    height: 100%;
  }
</style>
