<template lang="pug">
  div.con-box
    div.wrap
      div.box-header
      div.body-box
        div.row
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
                    | 名称：
                    span.nut-null *
                input.form-control(type="text" v-model="info.name" placeholder="请输入名称")
            div.form-group
              div.input-group
                span.input-group-prepend
                  span.input-group-text 备注：
                textarea.form-control(type="text" v-model="info.remark" rows="3" placeholder="请输入备注")
        div.footer-box
          button.btn.btn-success.ok-btn(type="button" @click="commitBtn()") 提交
          a.btn.btn-secondary.cancel-btn(@click="getCancel()") 取消
</template>
<script>
  let model
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '新增计数单位'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        info: {
          key: '',
          name: '',
          remark: ''
        }
      }
    },
    methods: {
      // 新增提交信息
      // 2018.6.11 王翀 新增接口
      commitBtn: function () {
        model.clickBtnAndDisable($('.ok-btn'), true)
        API.POST('classes/unit_price', model.info).then(function (response) {
          Core.alert('success', '新增成功')
          setTimeout(function () {
            window.history.back(-1)
          }, 1000)
        })
        .catch(function () {
          Core.alert('danger', '新增失败')
          model.clickBtnAndDisable($('.ok-btn'), false)
        })
      }
    },
    created () {
      model = this
    }
  }
</script>
<style lang="scss" scoped>
</style>
