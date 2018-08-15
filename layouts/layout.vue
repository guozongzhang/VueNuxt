<template lang="pug">
  div.wrapper
    <vue-header></vue-header>
    <vue-leftmenus></vue-leftmenus>
    div.content-wrapper
      <vue-crumbs></vue-crumbs>
      <section class="content">
        <nuxt/>
      </section>
      <vue-footer></vue-footer>
</template>
<script>
let model
import Header from '~/components/layout/header.vue'
import Crumbs from '~/components/layout/crumbs.vue'
import Leftmenus from '~/components/layout/leftmenus.vue'
import Footer from '~/components/layout/footer.vue'
export default {
  components: {
    'vue-header': Header,
    'vue-crumbs': Crumbs,
    'vue-leftmenus': Leftmenus,
    'vue-footer': Footer
  },
  methods: {
    // 初始化页面高度
    init: function () {
      $('.content').css('min-height', document.documentElement.clientHeight - 200)
    },


    // 图片预览插件初始化
    // 2018-06-29 yuguo
    initFancybox: function () {
      setTimeout(function () {
        $('.fancybox').fancybox()
      }, 1000)
    }
  },
  watch: {
    '$route': function () {
      this.initFancybox()
    }
  },
  mounted () {
    var $ = require('jquery')
    require('fancybox')($)
    require('fancybox/dist/css/jquery.fancybox.css')
    model = this
    model.init()
    model.initFancybox()
  }
}
</script>

<style lang="scss" scoped>
  .wrapper {
    position: static;
    overflow: visible;
  }
  .content-wrapper{
    background-color: #ecf0f5;
    position: absolute;
    top:50px;
    left: 200px;
    width: calc(100% - 200px);
    height: 100%;
  }
  .content {
    padding: 5px 15px;
    font-family: '微软雅黑';
  }
</style>
