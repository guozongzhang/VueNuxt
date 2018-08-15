<template lang="pug">
  div 
    <nuxt/>
</template>
<script>
let model

export default {
  methods: {
    // 初始化数据
    // 2018-06-04 yuguo
    init: function () {
      // 检测页面是否正确加载完成
      if (Number($('.login-box').length) === 0) {
        window.location.reload()
      }
    }
  },
  mounted () {
    model = this
    model.init()
  }
}
</script>
<style>
</style>
