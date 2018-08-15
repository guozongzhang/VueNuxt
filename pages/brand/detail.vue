<template lang="pug">
  div.con-box
    div.wrap
      div.box-header
      div.body-box
        div.row(v-if="!loadingState")
          div.col-md-4.col-lg-4
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 中文名称： 
                span.text-control {{info.com_brand_name}}
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 英文名称： 
                span.text-control {{info.english_name}}
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 品牌排序： 
                span.text-control {{info.order}}
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 授权证书： 
                div.upload-box
                  a.fancybox(rel="group" :href="info.auth_cert_url")
                    img(:src="info.auth_cert_url" style="max-width: 80px;max-height: 80px;")
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 品牌商标： 
                div.upload-box
                  a.fancybox(rel="group" :href="info.logo_url")
                    img(:src="info.logo_url" style="max-width: 80px;max-height: 80px;")
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    | 经营范围：
                span.text-control {{info.com_brand_explain || '暂无'}}
      div.loading-box(v-if="loadingState")
          vueloading
</template>
<script>
  let model
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '品牌详情'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingState: true,
        info: {
          com_brand_name: '',
          auth_cert_url: '',
          english_name: '',
          com_brand_explain: '',
          logo_url: '',
          order: 0
        }
      }
    },
    methods: {
      // 初始化数据 
      // 2018-07-05 yuguo
      init: function () {
        model.loadingState = true
        let id = this.$route.query.id || 0
        API.GET('classes/companys_brand', {id: id}).then(function (response) {
          let res = response.data
          model.loadingState = false
          model.info = {
            com_brand_name: res.com_brand_name,
            auth_cert_url: res.auth_cert_url,
            english_name: res.english_name,
            com_brand_explain: res.com_brand_explain,
            logo_url: res.logo_url,
            order: res.order
          }
        })
        .catch(function (error) {
          Core.alert('danger', '数据加载失败')
        })
      }
    },
    created () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
</style>
