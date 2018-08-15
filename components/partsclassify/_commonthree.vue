<template lang="pug">
  div.modal.fade#commonthree(tabindex="-1" role="dialog" aria-labelledby="myModalLabel")
    div.modal-dialog(role="document")
     div.modal-content
        div.modal-header
          h4.modal-title {{modelinfo.type == 'add' ? '新增' : '编辑'}}三级分类
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
                  | 所属料单：
                  span.nut-null *
              select.form-control(v-model="modelinfo.material_category")
                option(value="-1") 请选择
                option(v-for="item in matArr" v-bind:value="item.name") {{item.alias}}
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
  import storage from '~/plugins/storage'
  export default {
    props: ['info'],
    data () {
      return {
        matArr: [],
        hadclick: false,
        modelinfo: {
          id: 0,
          name: '',
          type: '',
          remark: '',
          material_category: -1,
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
            material_category: this.info.material_category || -1,
            remark: this.info.remark,
            state: this.info.state
          }
          $('#commonthree').modal('show')
        },
        deep: true
      }
    },
    methods: {
      // 初始化数据(获取所属料单数据)
      init: function () {
        let obj = storage.get('selecttable')
        model.matArr = _.filter(obj, (sub) => {
          return sub.state_types == 'partmaterialtype'
        })
      },


      // 提交模态框数据
      submitType: function () {
        if (_.isEmpty(model.modelinfo.name)) {
          Core.alert('danger', '分类名称不能为空')
          return
        }
        if (model.modelinfo.material_category == -1) {
          Core.alert('danger', '请选择所属料单')
          return
        }
        model.hadclick = true
        model.$emit('addEditThreeItem', model.modelinfo)
      }
    },
    mounted () {
      require('bootstrap')
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
</style>
