<template lang="pug">
  div.modal.fade#commontwo(tabindex="-1" role="dialog" aria-labelledby="myModalLabel")
    div.modal-dialog(role="document")
     div.modal-content
        div.modal-header
          h4.modal-title {{modelinfo.type == 'add' ? '新增' : '编辑'}}二级分类
          button.close(type="button" data-dismiss="modal" aria-label="Close")
        div.modal-body 
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 分类名称： 
                  span.nut-null *
              input.form-control(type="text" v-model="modelinfo.name" placeholder="请输入")
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 分类图标： 
                  span.nut-null *
              img(:src="modelinfo.sp_icon_url" v-if="modelinfo.sp_icon_url")
              <vueuploadumg flag="signleimg" v-model="modelinfo.sp_icon_url"></vueuploadumg>
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 备注： 
              textarea.form-control(type="text" rows="3" v-model="modelinfo.remark" placeholder="请输入备注")
        div.modal-footer
          button.btn.btn-success(@click="submitType()" type="button" v-bind:disabled="hadclick") 提交
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
          name: '',
          type: '',
          remark: '',
          sp_icon_url: '',
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
            type: this.info.type,
            name: this.info.name,
            sp_icon_url: this.info.sp_icon_url,
            remark: this.info.remark,
            state: this.info.state
          }
          $('#commontwo').modal('show')
        },
        deep: true
      }
    },
    methods: {
      // 提交模态框数据
      submitType: function () {
        if (_.isEmpty(model.modelinfo.name)) {
          Core.alert('danger', '分类名称不能为空')
          return
        }
        if (_.isEmpty(model.modelinfo.sp_icon_url)) {
          Core.alert('danger', '分类图标不能为空')
          return
        }
        model.hadclick = true
        model.$emit('addEditTwoItem', model.modelinfo)
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
