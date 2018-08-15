<template lang="pug">
  div.modal.fade#additem(tabindex="-1" role="dialog" aria-labelledby="myModalLabel")
    div.modal-dialog(role="document")
      div.modal-content
        div.modal-header
          button.close(type="button" data-dismiss="modal" aria-label="Close")
          h4.modal-title 分类
        div.modal-body 
          div.form-group
            label 分类名称
            span.nut-null *
            input.form-control(type="text" v-model="modelinfo.name")
          div.form-group
            label {{typeTitle}}分类逻辑字段
            span.nut-null *
            select.form-control(v-model="modelinfo.logic_type")
              option(value="-1") 请选择分类   
              option(v-for="item in logicTypes" v-bind:value="item.name") {{item.alias}}
          div.form-group(v-show="modelinfo.level == 'three'")
            label 绑定五金孔位方案
            span.not-null *
            select.form-control(v-model="modelinfo.hole_poi_hardware_hole_config")
              option(value="-1") 请选择分类
              option(value="0") 不适用
              option(v-for="item in holeConfigs" v-bind:value="item.id") {{item.name}}    
        div.modal-footer
          button.btn.btn-success.ok-btn(type="button" @click="submitType()") 提交
          a.btn.btn-secondary.cancel-btn 取消

</template>
<script>
  let model
  let _ = require('underscore')
  //  表名映射 2018.7.3 王翀
  let levelTabel = {
    'one': 'material_top_types',
    'two': 'material_second_types',
    'three': 'material_third_types'
  }
  import API from '~/plugins/axios'
  export default {
    props: ['info', 'typeData'],
    data () {
      return {
        hadclick: false,
        logicTypes: [],  //  绑定逻辑下拉框
        logicOne: [],  //  一级逻辑
        logicTwo: [],  //  二级逻辑
        logicThree: [],  //  三级逻辑
        typeTitle: '',  //  显示 一级/二级/三级
        holeConfigs: [],  //  孔位信息
        modelinfo: {
          id: 0,
          level: '',
          name: '',
          type: '',
          logic_type: '',
          switch_state: '',
          state: 0,
          active_one: 0,
          active_two: 0,
          hole_poi_hardware_hole_config: 0
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
            logic_type: this.info.logic_type,
            switch_state: this.info.switch_state,
            state: this.info.state,
            active_one: this.info.active_one,
            active_two: this.info.active_two,
            hole_poi_hardware_hole_config: this.info.hole_poi_hardware_hole_config
          }
          $('#additem').modal('show')
          model.logicTypes = []
          if (model.modelinfo.level == 'one') {
            model.logicTypes = model.logicOne
          }
          if (model.modelinfo.level == 'two') {
            model.logicTypes = model.logicTwo
          }
          if (model.modelinfo.level == 'three') {
            model.logicTypes = model.logicThree
          }
        },
        deep: true
      }
    },
    methods: {
      submitType: function () {
        if (_.isEmpty(model.modelinfo.name)) {
          Core.alert('error', '分类名称不能为空')
          return
        }
        // model.hadclick = true
        if (model.modelinfo.type == 'add') {
          //  添加
          model.saveNewData(levelTabel[model.modelinfo.level])
        } else {
          //  编辑
          model.updateOldData(levelTabel[model.modelinfo.level])
        }
      },
      //  新增分类
      saveNewData: async function (tableName) {
        let tmp = {
          name: model.modelinfo.name,
          logic_type: model.modelinfo.logic_type,
          switch_state: 'off'
        }
        if (model.modelinfo.level === 'two') {
          tmp.parent_poi_material_top_types = model.info.active_one
        }
        if (model.modelinfo.level === 'three') {
          tmp.hole_poi_hardware_hole_config = model.modelinfo.hole_poi_hardware_hole_config
          tmp.parent_poi_material_second_types = model.info.active_two
        }
        let result = await API.POST('classes/'+ tableName, tmp)
        model.modelinfo.switch_state = 'off'
        model.$emit('componentsSubmitClick', model.modelinfo)
        $('#additem').modal('hide')
        Core.alert('success', '新建成功！')
      },
      //  编辑分类
      updateOldData: async function (tableName) {
        let obj = {
          id: model.modelinfo.id,
          name: model.modelinfo.name,
          logic_type: model.modelinfo.logic_type,
          switch_state: model.modelinfo.switch_state
        }
        if (model.modelinfo.level == 'three') {
          obj.hole_poi_hardware_hole_config = model.modelinfo.hole_poi_hardware_hole_config
        }
        let result = await API.PUT('classes/'+ tableName, obj)
        $('#additem').modal('hide')
        Core.alert('success', '更新成功！')
        model.$emit('componentsSubmitClick', model.modelinfo)
      },
      //  获取孔位方案
      getHole: async function () {
        let result = await API.GET('classes/hardware_hole_config')
        model.holeConfigs = result.data.items
      },
      //  根据level获取逻辑字段列表数据
      getLogicTypes: async function () {
        let param = {
          where: '{"state_types":{"$in":["mat_logic_thrtype","mat_logic_twotype","mat_logic_onetype","material_top_types"]}}'
        }
        let classes = 'classes/selectable_states'
        let result = await API.GET(classes, param)
        result.data.items.forEach((item) => {
          if (item.state_types == 'mat_logic_onetype') {
            model.logicOne.push(item)
          }
          if (item.state_types == 'mat_logic_twotype') {
            model.logicTwo.push(item)
          }
          if (item.state_types == 'mat_logic_thrtype') {
            model.logicThree.push(item)
          }
        })
      }
    },
    mounted () {
      require('bootstrap')
      model = this
      model.getLogicTypes()
      model.getHole()
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
