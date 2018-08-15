<template lang="pug">
  div.modal.fade#wardrobethree(tabindex="-1" role="dialog" aria-labelledby="myModalLabel")
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
                  | 是否显示：  
                  span.nut-null *
              span.switch-plug(:data-content="modelinfo.show_in_design == '1' ? '启用' : '隐藏'" :data-switch="modelinfo.show_in_design == '1' ? 'on' : 'off'" @click="isShow()")
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 模型分类：
                  span.nut-null *
              select.form-control(v-model="modelinfo.model_types_id_poi_model_types")
                option(value="-1") 请选择
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
                  | 板件样式：
                  span.nut-null *
              select.form-control(v-model="modelinfo.style_poi_technology_board_style")
                option(value="-1") 请选择
                option(v-for="item in boardArr" v-bind:value="item.id") {{item.name}}
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 命名前缀： 
                  span.nut-null *
              input.form-control(type="text" v-model="modelinfo.auto_name_prefix" placeholder="请输入")
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
        hadclick: false,
        modelArr: [],
        logicArr: [],
        boardArr: [],
        modelinfo: {
          id: 0,
          type: '',
          name: '',
          show_in_design: 1,
          model_types_id_poi_model_types: -1,
          logic_type: -1,
          style_poi_technology_board_style: -1,
          auto_name_prefix: '',
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
            show_in_design: this.info.show_in_design,
            logic_type: this.info.logic_type,
            style_poi_technology_board_style: this.info.style_poi_technology_board_style,
            model_types_id_poi_model_types: this.info.model_types_id_poi_model_types,
            auto_name_prefix: this.info.auto_name_prefix,
            remark: this.info.remark,
            state: this.info.state
          }
          model.getModelType()
          $('#wardrobethree').modal('show')
        },
        deep: true
      },

    },
    methods: {
      // 初始化数据(获取模型分类、逻辑常量)
      // 2018-06-28 yuguo
      init: async function () {
        let obj = storage.get('selecttable')
        model.logicArr = _.filter(obj, (sub) => {
          return sub.state_types == 'c2m_pt_type'
        })
        
        let board = await API.GET('classes/technology_board_style', {order: 'id', switch_state: 'on'})
        model.boardArr = board.data.items
      },

      // 根据二级分类的模型分类，获取三级分类的模型分类
      getModelType: async function () {
        let res = await API.GET('classes/model_types', {order: 'id', where: {sp_type_poi_model_simple_types: model.info.sp_type_poi_model_simple_types}})
        model.modelArr = res.data.items
      },

      // 是否显示
      isShow: function () {
        model.modelinfo.show_in_design = model.modelinfo.show_in_design == 1 ? 0 : 1
      },

      // 提交模态框数据
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
