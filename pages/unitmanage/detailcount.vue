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
                    | 英文key： 
                    span.nut-null *
                span.text-control {{info.key}}
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    |名称：
                    span.nut-null *
                span.text-control {{info.name}}
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 备注：
                span.text-control {{info.remark}}
      div.loading-box(v-if="loadingState")
          vueloading
</template>
<script>
  let model
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '计数单位详情'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingState: true,
        info: {
          key: '',
          name: '',
          remark: ''
        }
      }
    },
    methods: {
      // 初始化数据 2018.6.7 王翀
      init: function () {
        model.loadingState = true
        let id = this.$route.query.id || 0
        API.GET('classes/unit_count', {id: id}).then(function (response) {
          let res = response.data
          model.loadingState = false
          model.info = {
            id: res.id,
            key: res.key || '',
            name: res.name || '',
            remark: res.remark || ''
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
