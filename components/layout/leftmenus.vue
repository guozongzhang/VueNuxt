<template lang="pug">
  div.dpjia-sidebar
    section.sidebar
      ul.subbar-menu
        li.header 控制台
        li.treeview-item
          nuxt-link.contraller(to="/home")
            i.fa.fa-globe
            span 总览
      ul.subbar-menu(data-widget="tree" v-if="leftArr.length > 0")
        template(v-for="menuitem in leftArr")
          li.header {{menuitem.name}}
          li.treeview-item(v-for="subitem in menuitem.menus")
            a.contraller(:href="subitem.href" @click="openSubs(subitem, $event)" :class="subitem.showsub ? 'color-hover' : ''")
              i.fa(:class="subitem.icon")
              span {{subitem.name}}
              span.pull-right-container(v-if="subitem.subs")
                i.fa.pull-right(:class="subitem.showsub ? 'fa-angle-down' : 'fa-angle-left'")
            ul.treeview-submenu(v-show="subitem.showsub")
              li.subitems(v-for="lis in subitem.subs" v-if="lis.powershow")
                nuxt-link.back(:to="String(lis.href)" :class="lis.showhref ? 'color-hover' : ''")
                  i.fa.fa-circle-o
                  | {{lis.name}}
      ul.subbar-menu
        li.header 
        li.treeview-item
          nuxt-link.contraller(to="/test")
            i.fe.fe-grid
            span 示例数据
</template>
<script>
  import storage from '~/plugins/storage'
  let model
  let _ = require('underscore')
  let menusArr = require('../../lib/menubar.js')
  export default {
    data () {
      return {
        leftArr: [],
        activeItem: '',
        activeSub: ''
      }
    },
    watch: {
      '$route': function () {
        this.init()
      }
    },
    methods: {
      // 初始化数据，根据menusbar.js和缓存权限，对比左侧菜单显示的权限
      init: function () {
        let controllar = this.$route.path.split('/')[1] || ''
        let powersArr = String(((storage.get('dpjuserinfo') || {}).role_id_poi_role || {}).visitor_scope).split(',') || []
        menusArr.forEach((items) => {
          items.menus.forEach((me) => {
            me.showsub = _.indexOf(me.controllar, controllar) > -1
            let tmparr = me.subs || []
            tmparr.forEach((subitem) => {
              subitem.showhref = String(subitem.href) === String(this.$route.path) ? true : false
              subitem.powershow = _.indexOf(powersArr, subitem.power) > -1
            })
          })
        })
        
        model.leftArr = menusArr
        $('.dpjia-sidebar').height(document.body.scrollHeight)
        // 调整左侧高度
        $(window).scroll(function () {// 当浏览器大小变化时
          $('.dpjia-sidebar').height(document.body.scrollHeight - 50)
        })
      },

      // 选择左侧菜单栏
      // 2018-06-02 yuguo
      // obj(object)当前操作对象
      openSubs: function (obj, event) {
        menusArr.forEach((items) => {
          items.menus.forEach((me) => {
            if (me.name == obj.name) {
              obj.showsub = !obj.showsub
            } else {
              me.showsub = false
            }
          })
        })
      }
    },
    mounted () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
  .dpjia-sidebar {
    position: absolute;
    left: 0;
    width: 200px;
    height: calc(100% - 50px);
    background-color: #222d32;
    color: #fff;
    .header{
      background-color: #1a2226;
      color: #4b646f;
      padding-left: 10px;
    }
    .subbar-menu{
      .treeview-item{
        a.contraller{
          position: relative;
          display: block;
          color: #b8c7ce;
          padding: 12px 5px 12px 15px;
          .fa, .fe{
            margin-right: 5px;
          }
          .pull-right-container {
            .fa,.fe{
              position: absolute;
              right: 10px;
              top: 50%;
              margin-top: -7px;
            }
          }
        }
        a:hover, .color-hover{
          color: #fff !important;
        }
        .showsub {
          display: none;
        }
        .treeview-submenu{
          background: #2c3b41;
          .subitems {
            .fa-circle-o {
              margin-right: 8px;
            }
            a{
              display: block;
              font-size: 12px;
              color: #8aa4af;
              padding: 10px 5px 10px 26px;
            }
            a:hover{
              color: #fff;
            }
          }
        }
      }
    }
  }
</style>
