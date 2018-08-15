<template lang="pug">
  div.modal.fade#hardwaretwo(tabindex="-1" role="dialog" aria-labelledby="myModalLabel")
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
              img(:src="modelinfo.icon_url" v-if="modelinfo.icon_url")
              <vueuploadumg flag="signleimg" v-model="modelinfo.icon_url"></vueuploadumg>
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 模型分类：
                  span.nut-null *
              select.form-control(v-model="modelinfo.model_type")
                option(value="-1") 请选择
                option(v-for="item in modelArr" v-bind:value="item.id") {{item.name}}
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 逻辑常量：
                  span.nut-null *
              select.form-control(v-model="modelinfo.logic")
                option(value="-1") 请选择
                option(v-for="item in logicArr" v-bind:value="item.name") {{item.alias}}
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 编辑器显示：  
                  span.nut-null *
              span.switch-plug(:data-content="modelinfo.is_show_on_editor_assets == 'Y' ? '是' : '否'" :data-switch="modelinfo.is_show_on_editor_assets == 'Y' ? 'on' : 'off'" @click="isShow(modelinfo)")
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
        hadclick: false,
        modelArr: [
          {
            id: 0,
            name: '暂无'
          }
        ],
        logicArr: [],
        modelinfo: {
          id: 0,
          type: '',
          name: '',
          icon_url: '',
          model_type: -1,
          logic: -1,
          is_show_on_editor_assets: 1,
          remark: '',
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
            icon_url: this.info.icon_url,
            model_type: this.info.model_type,
            logic: this.info.logic,
            is_show_on_editor_assets: this.info.is_show_on_editor_assets,
            remark: this.info.remark,
            state: this.info.state
          }
          $('#hardwaretwo').modal('show')
        },
        deep: true
      }
    },
    methods: {
      // 初始化数据（获取逻辑常量）
      // 2018-06-29 yuguo
      init: function () {
        let obj = storage.get('selecttable')
        model.logicArr = _.filter(obj, (sub) => {
          return sub.state_types == 'hardTwoPartLogic'
        })
      },

      // 是否编辑器素材显示
      // 2018-06-29 yuguo
      // obj(object)当前对象
      isShow: function (obj) {
        model.modelinfo.is_show_on_editor_assets = model.modelinfo.is_show_on_editor_assets == 'Y' ? 'N' : 'Y'
      },

      // 提交模态框数据
      submitType: function () {
        model.hadclick = true
        model.$emit('addEditTwoItem', model.modelinfo)
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
