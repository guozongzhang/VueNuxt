<template lang="pug">
  div.modal.fade#forbidden(tabindex="-1" role="dialog" aria-labelledby="myModalLabel")
    div.modal-dialog(role="document")
      div.modal-content
        div.modal-header
          h4.modal-title 违规原因
          button.close(type="button" data-dismiss="modal" aria-label="Close")
        div.modal-body 
          div.form-group
            label {{modelinfo.title}}禁用的原因：
            textarea.form-control(type="text" rows="3" placeholder="请输入禁用原因" v-model="modelinfo.reason") 
        div.modal-footer
          button.btn.btn-flat.bg-olive(@click="submitType()" type="button" v-bind:disabled="hadclick") 提交
          button.btn.btn-flat.bg-maroon(data-dismiss="modal" type="button") 取消
</template>
<script>
  let model
  let _ = require('underscore')
  export default {
    props: ['info'],
    data () {
      return {
        hadclick: false,
        modelinfo: {
          title: '',
          reason: '',
          state: 0
        }
      }
    },
    watch: {
      info: {
        handler: function () {
          model.hadclick = false
          model.modelinfo = {
            title: this.info.title,
            reason: '',
            state: this.info.state
          }
          $('#forbidden').modal('show')
        },
        deep: true
      }
    },
    methods: {
      submitType: function () {
        if (_.isEmpty(model.modelinfo.reason)) {
          Core.alert('error', '禁用原因不能为空')
          return
        }
        model.hadclick = true
        model.$emit('forbiddenItem', model.modelinfo)
      }
    },
    mounted () {
      require('bootstrap')
      model = this
    }
  }
</script>
<style lang="scss" scoped>
</style>
