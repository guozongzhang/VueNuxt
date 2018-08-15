<template lang="pug">
  div.error-box
    img(src="/images/404.gif")
    img(src="/images/404.png")
    p 没有权限
      a(:href="pre_url") &nbsp;&nbsp;返回上一级页面
</template>
<script>
  export default {
    head () {
      return {
        title: '错误'
      }
    },
    data () {
      return {
        pre_url: 'http://www.dpjia.com'
      }
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
