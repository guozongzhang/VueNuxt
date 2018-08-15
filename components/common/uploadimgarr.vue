<template lang="pug">
  div.upload-box
    span.img-box(v-for="sub in urls" v-if="showimg && urls.length > 0")
      img(:src="sub.url")
      span.fa.fa-trash.deleteimgicon(@click="delimg(sub)")
    form.form-box(:id="'upload_' + flag" method='post' enctype='multipart/form-data' @click="uploadChange($event)")
      span.fe(v-bind:class="urls.length > 0 ? 'fe-plus' : 'fe-plus'")
      span {{urls.length > 0 ? '继续添加' : '上传图片'}}
      input(type="file" name="files[]" @change="uploadImg()" style='display:none' multiple)

</template>
<script>
  let ENV
  import axios from '~/plugins/axios'
  import Cookies from 'js-cookie'
  export default {
    props: ['flag', 'value', 'showimg'],
    data () {
      return {
        urls: []
      }
    },
    watch: {
      'value': function () {
        this.init()
      }
    },
    methods: {
      init: function () {
        this.urls = this.value
      },

      // 点击上传
      uploadChange: async function (event) {
        let objId = '#upload_' + this.flag
        $(objId).find('input[type="file"]').click()
      },

      // 删除图片
      // obj(object) 当前删除对象
      delimg: function (obj) {
        let _self = this
        _self.urls.splice($.inArray(obj, _self.urls, 0), 1)
        _self.$emit('input', _self.urls)
      },

      // 上传图片
      uploadImg: function () {
        let _self = this
        let objId = '#upload_' + this.flag
        var option = {
          url : ENV.API + 'upload',
          type : 'POST',
          data: {
            mode: 'image',
            mutiple: '1'
          },
          crossDomain: true,
          headers : {
            'X-DP-Key': ENV.KEY || '222',
            'X-DP-ID': ENV.ID || '111',
            'X-DP-Token': Cookies.get('token-' + process.env.port)
          }, //添加请求头部
          success : function(data) {
            _self.urls = _self.urls.concat(data)
            _self.$emit('input', _self.urls)
          },
          error: function(error) {
            Core.alert('上传失败,请重新上传')
            return
          }
        }
        $(objId).ajaxSubmit(option)
      }
    },
    mounted () {
      ENV = require('../../config/local_env.json')
      require('~/static/js/jquery.form.js')
      this.init()
    }
  }
</script>
<style lang="scss" scoped>
  // 上传按钮样式
  .upload-box{
    position: relative;
    z-index: 11;
    display: inline-block;
    max-height: 140px;
    line-height: 36px;
    cursor: pointer;
    .img-box{
      position: relative;
      display: inline-block;
      .deleteimgicon{
        display: none;
        position: absolute;
        top: -5px;
        right: 5px;
        font-size: 20px;
        color: #f00;
        z-index: 10;
      }
      img{
        display: inline-block;
        max-width: 120px;
        max-height: 120px;
        margin-right: 20px;
      }
    }
    .img-box:hover{
      .deleteimgicon{
        color: #FF5722;
        display: inline-block;
      }
    }
    .form-box{
      display: inline-block;
      width: 92px;
      height: 36px;
      text-align: center;
      border: 1px solid #ddd;
       border-radius: 3px;
      input[type="file"] {
        width: 92px;
        height: 36px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
      }
    }
  }
  .form-box:hover{
    color: #999;
  }
</style>