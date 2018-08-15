<template lang="pug">
  ul.nav-tab.clear
    li(v-for="sub in arr" v-bind:class="active == sub.active ? 'active' : ''")
      nuxt-link(:to="sub.href") {{sub.name}}
            
</template>
<script>
  let model
  export default {
    props: ['obj'],
    data () {
      return {
        arr: [
          {
            href: "/parts/commonlist",
            name: '普通零部件列表',
            active: 'commonlist'
          },
          {
            href: "/parts/wardrobelist",
            name: '衣柜零部件列表',
            active: 'wardrobelist'
          },
          {
            href: "/parts/hardwarelist",
            name: '五金零部件列表',
            active: 'hardwarelist'
          },
          {
            href: "/parts/tableslist",
            name: '桌台零部件列表',
            active: 'tableslist'
          }
        ],
        active: 'commonlist'
      }
    },
    methods: {
      // 初始化数据
      // 2018-06-22 yuguo
      init: function () {
        model.active = this.obj
      }
    },
    mounted () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
</style>