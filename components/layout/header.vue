<template lang="pug">
  div.dpjia-header
    a.logo(href="/home")
      span
        img.logo-lg(src="/images/logo.png")
    nav.header-navbar
      a.msg-box(href="#" @click="switchMenu('msg')")
        i.fa.fa-bell-o
        span.label 10
        ul.submenu-box(v-if="ismsgshow")
          li.dot-up
          li.title 您有10条消息 
          li
            ul
              li
                a.notice-box(href="/messagemanage/detail}")
                  h5
                    span.fa.fa-windows.notice-logo
                    |系统通知
                    small.pull-right 2018-12-02
                  div.notice-content 您有一个待派单的订单
              li
                a.notice-box(href="/messagemanage/detail}")
                  h5
                    span.fa.fa-windows.notice-logo
                    |系统通知
                    small.pull-right 2018-12-02
                  div.notice-content 您有一个待派单的订单
          li.all
            a(href="#") 查看所有
      a.user-box(href="#" @click="switchMenu('user')")
        img(:src="info.imgurl || 'http://cimg.dpjia.com/images/b_art_img.jpg'" alt="User Image")
        span.name {{info.name}}
        ul.submenu-box(v-if="isusershow")
          li.dot-up
          li.sublist
            a(href="/mem/me") 修改资料
          li.sublist
            a(href="jsvascript:;" v-on:click="logout()") 注销
</template>
<script>
  let model
  import storage from '~/plugins/storage'
  let Cookies = require('js-cookie')
  export default {
    data () {
      return {
        ismsgshow: false,
        isusershow: false,
        info: {
          name: '',
          imgurl: ''
        }
      }
    },
    methods: {
      init: function () {
        let info = storage.get('dpjuserinfo')
        model.info = {
          name: info.username || '',
          imgurl: info.profile_url || ''
        }
      },

      // 切换子菜单
      // str: msg-消息；user: 用户
      switchMenu: function (str) {
        // 消息
        if (str === 'msg') {
          model.ismsgshow = !model.ismsgshow
        }

        // 用户信息
        if (str === 'user') {
          model.isusershow = !model.isusershow
        }
      },

      // 注销
      // 2018-06-04 yuguo
      logout: function () {
        Cookies.set('token-' + process.env.port, null)
        storage.set('dpjuserinfo', null)
        storage.set('selecttable', null)
        this.$router.push('/login/login')
        // this.$store.$router.push({ path: '/login/login' })
        // window.location.href = '/login/login'
      }
    },
    mounted () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
  .dpjia-header{
    position: relative;
    background-color: #3c8dbc;
    height: 50px;
    .logo {
      width: 200px;
      height: 50px;
      display: block;
      background-color: #357ca5;
      text-align: center;
      .logo-lg{
        width: 140px;
        margin-top: 15px;
        margin-left: 10px;
      }
    }
    .header-navbar {
      position: absolute;
      top: 0;
      right: 0px;
      width: 180px;
      height: 50px;
      a{
        text-decoration: none;
        .submenu-box{
          position: absolute;
          top: 50px;
          right: 0;
          z-index: 800;
          background-color: #fff;
          border: 1px solid #eee;
        }
      }
      .msg-box{
        width: 50px;
        height: 50px;
        position: absolute;
        left: 0;
        .submenu-box{
          width: 280px;
          .title {
            height: 32px;
            line-height: 32px;
            padding: 0 10px;
            border-bottom: 1px solid #f4f4f4;
            color: #333;
          }
          .dot-up {  
            position: absolute;
            top: -7px;
            right: 20px;
            font-size: 0;  
            line-height: 0;  
            border-width: 7px;  
            border-color: #fff;  
            border-top-width: 0;  
            border-style: dashed;  
            border-bottom-style: solid;  
            border-left-color: transparent;  
            border-right-color: transparent; 
          } 
          .notice-box{
            display: block;
            padding: 10px;
            border-bottom: 1px solid #f4f4f4;
            .fa-windows {
              font-size: 14px;
              margin-right: 5px;
              color: #3c8dbc;
            }
            h5{
              font-size: 14px;
              color: #333;
            }
            .notice-content {
              font-size: 12px;
            }
          }
        }
        i{
          position: absolute;
          top: 18px;
          left: 15px;
          color: #fff;
        }
        .label{
          position: absolute;
          right: 0;
          top: 8px;
          background-color:#FF5722;
          color: #fff;
        }
        .all {
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          text-align: center;
        }
      }
      .user-box{
        position: absolute;
        left: 60px;
        img{
          position: relative;
          top: 10px;
          width: 30px;
          height: 30px;
          border-radius: 100%;
        }
        .name {
          position: relative;
          top: 10px;
          left: 5px;
          color: #fff;
        }
        li.sublist{
          width: 120px;
          height: 32px;
          line-height: 32px;
          padding: 0 10px;
          border-bottom: 1px solid #f4f4f4;
          color: #333;
        }
        .submenu-box{
          position: absolute;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          .dot-up {
            position: absolute;
            top: -7px;
            right: 15px;
            font-size: 0;  
            line-height: 0;  
            border-width: 7px;  
            border-color: #fff;  
            border-top-width: 0;  
            border-style: dashed;  
            border-bottom-style: solid;  
            border-left-color: transparent;  
            border-right-color: transparent; 
          } 
        }
      }
    }
  }
</style>
