<template lang="pug">
  div.modal.fade#goodstype(tabindex="-1" role="dialog" aria-labelledby="myModalLabel")
    div.modal-dialog(role="document")
     div.modal-content
        div.modal-header
          h4.modal-title {{modelinfo.type == 'add' ? '新增' : '编辑'}}{{modelinfo.level == 'two' ? '二' : '三'}}级分类
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
              img(:src="modelinfo.icon_url" v-if="modelinfo.icon_url")
              <vueuploadumg flag="signleimg" v-model="modelinfo.icon_url"></vueuploadumg>
          div.form-group
            div.input-group
              span.input-group-prepend
                span.input-group-text 
                  | 模型分类：
              select.form-control(v-model="modelinfo.model_types")
                option(value="-1") 请选择
                option(v-for="item in modelArr" v-bind:value="item.id") {{item.name}}
        div.modal-footer
          button.btn.btn-success(@click="submitType()" type="button" v-bind:disabled="hadclick") 提交
          button.btn.btn-flat.bg-maroon(data-dismiss="modal" type="button") 取消
</template>
<script>
  let model
  let modelTwo = []
  let modelThree = []
  let _ = require('underscore')
  import API from '~/plugins/axios'
  export default {
    props: ['info'],
    data () {
      return {
        hadclick: false,
        modelArr: [],
        modelinfo: {
          id: 0,
          type: '',
          level: '',
          name: '',
          icon_url: '',
          sp_type_poi_model_simple_types: 0,
          model_types: -1,
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
            level: this.info.level,
            name: this.info.name,
            sp_type_poi_model_simple_types: this.info.sp_type_poi_model_simple_types,
            icon_url: this.info.icon_url,
            model_types: this.info.model_types,
            state: this.info.state
          }
          model.initData()
        },
        deep: true
      }
    },
    methods: {
      // 初始化数据
      // 2018-07-06 yuguo
      init: async function () {
        let two = await API.GET('classes/model_simple_types', {order: 'id', limit: 10000})
        modelTwo = two.data.items

        let three = await API.GET('classes/model_types', {order: 'id', limit: 10000})
        modelThree = three.data.items
      },

      // 初始化页面数据
      // 2018-07-06 yuguo
      initData: function () {
        if (model.modelinfo.level == 'two') {
          model.modelArr = modelTwo
        } else {
          model.modelArr = _.filter(modelThree, (sub) => {
            return sub.sp_type_poi_model_simple_types == model.modelinfo.sp_type_poi_model_simple_types
          })
        }
        $('#goodstype').modal('show')
      },

      // 提交模态框数据
       // 2018-07-06 yuguo
      submitType: function () {
        if (_.isEmpty(model.modelinfo.name)) {
          Core.alert('danger', '分类名称不能为空')
          return
        }
        if (_.isEmpty(model.modelinfo.icon_url)) {
          Core.alert('danger', '分类图标不能为空')
          return
        }
        model.hadclick = true
        model.$emit('addEditItem', model.modelinfo)
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
