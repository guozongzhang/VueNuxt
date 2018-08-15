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
            href: "/partsclassify/commonclassify",
            name: '普通零部件',
            active: 'commonclassify'
          },
          {
            href: "/partsclassify/wardrobeclassify",
            name: '衣柜零部件',
            active: 'wardrobeclassify'
          },
          {
            href: "/partsclassify/hardwareclassify",
            name: '五金零部件',
            active: 'hardwareclassify'
          },
          {
            href: "/partsclassify/tableclassify",
            name: '桌台零部件',
            active: 'tableclassify'
          }
        ],
        active: 'commonclassify'
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