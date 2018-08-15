<template lang="pug">
  div.modal.fade#wardrobetwo(tabindex="-1" role="dialog" aria-labelledby="myModalLabel")
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
                  | 是否显示：  
                  span.nut-null *
              span.switch-plug(:data-content="modelinfo.show_in_design == '1' ? '启用' : '隐藏'" :data-switch="modelinfo.show_in_design == '1' ? 'on' : 'off'" @click="isShow()")
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 分类图标： 
                  span.nut-null *
              img(:src="modelinfo.icon_url" v-if="modelinfo.icon_url")
              <vueuploadumg flag="signleimgs" v-model="modelinfo.icon_url"></vueuploadumg>
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 模型分类：
                  span.nut-null *
              select.form-control(v-model="modelinfo.model_type_poi_model_simple_types")
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
        modelinfo: {
          id: 0,
          name: '',
          type: '',
          show_in_design: 1,
          logic_type: -1,
          model_type_poi_model_simple_types: -1,
          remark: '',
          icon_url: '',
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
            model_type_poi_model_simple_types: this.info.model_type_poi_model_simple_types,
            icon_url: this.info.icon_url,
            remark: this.info.remark,
            state: this.info.state
          }
          $('#wardrobetwo').modal('show')
        },
        deep: true
      }
    },
    methods: {
      // 初始化数据(获取模型分类、逻辑常量)
      // 2018-06-28 yuguo
      init: async function () {
        let obj = storage.get('selecttable')
        model.logicArr = _.filter(obj, (sub) => {
          return sub.state_types == 'c2m_pt_sp_type'
        })
        let res = await API.GET('classes/model_simple_types', {order: 'id'})
        model.modelArr = res.data.items
      },

      isShow: function () {
        model.modelinfo.show_in_design = model.modelinfo.show_in_design == 1 ? 0 : 1
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
