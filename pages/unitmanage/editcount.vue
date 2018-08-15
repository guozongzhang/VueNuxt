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
                input.form-control(type="text" v-model="info.key" placeholder="请输入key")
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 
                    |名称：
                    span.nut-null *
                input.form-control(type="text" v-model="info.name" placeholder="请输入名称")
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 备注：
                textarea.form-control(type="text" v-model="info.remark" rows="3" placeholder="请输入备注")
        div.footer-box(v-if="!loadingState")
          button.btn.btn-success.ok-btn(type="button" @click="commitBtn()") 提交
          a.btn.btn-secondary.cancel-btn(@click="getCancel()") 取消
      div.loading-box(v-if="loadingState")
          vueloading
</template>
<script>
  let model
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '编辑计数单位'
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
      // 初始化数据
      // 2018-06-02 yuguo
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
      },

      // 编辑提交信息
      // 2018-06-02 yuguo
      commitBtn: function () {
        model.clickBtnAndDisable($('.ok-btn'), true)
        API.PUT('classes/unit_count', model.info).then(function (response) {
          Core.alert('success', '编辑成功')
          setTimeout(function () {
            window.history.back(-1)
          }, 1000)
        })
        .catch(function (error) {
          model.clickBtnAndDisable($('.ok-btn'), false)
          Core.alert('danger', '编辑失败')
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
