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
            href: "/goodsclassify/goodstype",
            name: '商品分类',
            active: 'goodstype'
          },
          {
            href: "/goodsclassify/styletype",
            name: '风格分类',
            active: 'styletype'
          },
          {
            href: "/goodsclassify/spacetype",
            name: '空间分类',
            active: 'spacetype'
          },
          {
            href: "/goodsclassify/materialtype",
            name: '材质分类',
            active: 'materialtype'
          },
          {
            href: "/goodsclassify/industrytype",
            name: '行业分类',
            active: 'industrytype'
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