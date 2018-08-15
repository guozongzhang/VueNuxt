<template lang="pug">
  div.modal.fade#additem(tabindex="-1" role="dialog" aria-labelledby="myModalLabel")
    div.modal-dialog(role="document")
      div.modal-content
        div.modal-header
          h4.modal-title {{modelinfo.type == 'add' ? '新增' : '编辑'}}分组
          button.close(type="button" data-dismiss="modal" aria-label="Close")
        div.modal-body 
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 名称： 
                  span.nut-null *
              input.form-control(type="text" placeholder="请输入" v-model="modelinfo.name")
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
          id: 0,
          level: '',
          name: '',
          type: '',
          switch_state: '',
          state: 0
        }
      }
    },
    watch: {
      info: {
        handler: function () {
          model.hadclick = false
          model.modelinfo = {
            id: this.info.id,
            level: this.info.level,
            name: this.info.name,
            type: this.info.type,
            switch_state: this.info.switch_state,
            state: this.info.state
          }
          $('#additem').modal('show')
        },
        deep: true
      }
    },
    methods: {
      submitType: function () {
        if (_.isEmpty(model.modelinfo.name)) {
          Core.alert('error', '分组名称不能为空')
          return
        }
        model.hadclick = true
        model.$emit('addEditItem', model.modelinfo)
      }
    },
    mounted () {
      require('bootstrap')
      model = this
    }
  }
</script>
<style lang="scss" scoped>
  .modal-content{
    .input-group-prepend{
      width: 60px !important;
    }
  }
</style>
