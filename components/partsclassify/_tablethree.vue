<template lang="pug">
  div.modal.fade#tablethree(tabindex="-1" role="dialog" aria-labelledby="myModalLabel")
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
                  | 模型分类：
                  span.nut-null *
              select.form-control(v-model="modelinfo.model_types_id_poi_model_types")
                option(value="-1") 请选择
                option(value="0") 暂无
                option(v-for="item in modelArr" v-bind:value="item.id") {{item.name}}
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 逻辑常量：
                  span.nut-null *
              select.form-control(v-model="modelinfo.logic_type")
                option(value="-1") 请选择
                option(v-for="item in logicArr" v-bind:value="item.name") {{item.alias}}
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 编辑器显示：  
                  span.nut-null *
              span.switch-plug(:data-content="modelinfo.show_in_design == '1' ? '是' : '否'" :data-switch="modelinfo.show_in_design == '1' ? 'on' : 'off'" @click="isShow(modelinfo)")
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
  import API from '~/plugins/axios'
  import storage from '~/plugins/storage'
  export default {
    props: ['info'],
    data () {
      return {
        modelArr: [],
        logicArr: [],
        hadclick: false,
        modelinfo: {
          id: 0,
          type: '',
          name: '',
          model_types_id_poi_model_types: -1,
          logic_type: -1,
          show_in_design: 1,
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
            sp_type_poi_model_simple_types: this.info.sp_type_poi_model_simple_types,
            model_types_id_poi_model_types: this.info.model_types_id_poi_model_types,
            logic_type: this.info.logic_type,
            show_in_design: this.info.show_in_design,
            remark: this.info.remark,
            state: this.info.state
          }
          $('#tablethree').modal('show')
        },
        deep: true
      }
    },
    methods: {
      // 初始化数据(获取所属料单数据)
      // 2018-06-29 yuguo
      init: async function () {
        let obj = storage.get('selecttable')
        model.logicArr = _.filter(obj, (sub) => {
          return sub.state_types == 'table_ThirdPartLogic'
        })

        let res = await API.GET('classes/model_types', {order: 'id', where: {sp_type_poi_model_simple_types: model.modelinfo.sp_type_poi_model_simple_types}})
        model.modelArr = res.data.items
      },

      // 是否编辑器素材显示
      // 2018-06-29 yuguo
      // obj(object)当前对象
      isShow: function (obj) {
        model.modelinfo.show_in_design = model.modelinfo.show_in_design == '1' ? '0' : '1'
      },

      // 提交模态框数据
      // 2018-06-29 yuguo
      submitType: function () {
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
