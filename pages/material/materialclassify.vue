<template lang="pug">
  div.con-box
    div.box.box-solid
      div.row(v-cloak)
        div.col-md-4
          div.stacked-box
            div.box-header 一级分类
            ul.nav-stacked
              li.item(v-for="one in firstType")
                a(@click="getNextLevels(one, 'one')" ) {{one.name}}
                  span.switch-plug(v-bind:data-content="one.switch_state == 'on' ? '启用' : '禁用'" v-bind:data-switch="one.switch_state" @click="switchState('one', one)")
                  i.fa.fa-pencil(@click="optItems('one', 'edit', one)")
                  i.fa.fa-trash(@click="destroyItemo('one', one)")
              li.plus-item(@click="optItems('one', 'add')")
                a
                  i.fa.fa-plus  
        div.col-md-4
          div.stacked-box
            div.box-header 二级分类
            ul.nav-stacked
              li.item(v-for="two in secondType")
                a(@click="getNextLevels(two, 'two')" ) {{two.name}}
                  i.fa.fa-pencil(@click="optItems('two', 'edit', two)")
                  i.fa.fa-trash(@click="destroyItemo('two', two)")
                span.switch-plug(v-bind:data-content="two.switch_state == 'on' ? '启用' : '禁用'" v-bind:data-switch="two.switch_state" @click="switchState('two', two)")
              li.plus-item(@click="optItems('two', 'add')" v-show="active_one != 0")
                a
                  i.fa.fa-plus  
        div.col-md-4
          div.stacked-box
            div.box-header 三级分类
            ul.nav-stacked
              li.item(v-for="three in thirdType")
                a(@click="getNextLevels(three, 'three')" ) {{three.name}}
                  i.fa.fa-pencil(@click="optItems('three', 'edit', three)")
                  i.fa.fa-trash(@click="destroyItemo('three', three)")
                span.switch-plug(v-bind:data-content="three.switch_state == 'on' ? '启用' : '禁用'" v-bind:data-switch="three.switch_state" @click="switchState('three', three)")
              li.plus-item(@click="optItems('three', 'add')" v-show="active_two != 0")
                a
                  i.fa.fa-plus  
          <add-edit-model :info="classifyData" v-on:componentsSubmitClick="submitClick"></add-edit-model>
</template>

<script>
  let model
  let objInfo
  let _ = require('underscore')
  //  表名映射 2018.7.3 王翀
  let levelTabel = {
    'one': 'material_top_types',
    'two': 'material_second_types',
    'three': 'material_third_types'
  }
  import modelVue from '~/components/material/addEdit.vue'
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '原料分类'
      }
    },
    layout: 'layout',
    components: {
      'add-edit-model': modelVue
    },
    data () {
      return {
        modelinfo: {
          id: 0,
          pid: 0,
          type: '',
          name: '',
          logic_type: -1,
          hole_poi_hardware_hole_config: -1
        },
        firstType: [],  //  一级分组
        secondType: [],  //  二级分组
        thirdType: [],  //  三级分组
        active_one: 0,
        active_two: 0,
        classifyData: {
          id: 0,
          level: '',
          name: '',
          type: '',
          switch_state: '',
          state: 0
        }
      }
    },
    methods: {
      // 初始化数据 2018.6.22 王翀
      init: async function () {
        await model.getFirstTypeData()
      },

      // 初始化基础数据 2018.6.22 王翀
      initbasicData: function (obj) {
      },

      // 获取一级分类数据 2018.6.22 王翀
      // obj(object) query信息
      getFirstTypeData: async  function (obj) {
        let result = await API.GET('classes/material_top_types')
        model.firstType = result.data.items
      },

      //  弹出框点击提交
      submitClick: function (obj) {
        if (obj.type == 'add') {
          //  新增
          if (obj.level == 'one') {
            model.firstType.push(obj)
          }
          if (obj.level == 'two') {
            model.secondType.push(obj)
          }
          if (obj.level == 'three') {
            model.thirdType.push(pbj)
          }
        } else {
          //  编辑
          objInfo.name = obj.name
          objInfo.switch_state = obj.switch_state
          objInfo.logic_type = obj.logic_type
          objInfo.hole_poi_hardware_hole_config =obj.hole_poi_hardware_hole_config
        }
      },

      //  选择分类
      getNextLevels: async function (obj, level) {
        // 点击一级分类，获取二级分类数据
        if (level === 'one') {
          if (model.active_one == obj.id) { return }
          model.active_one = obj.id
          model.secondType = []
          model.thirdType = []
          model.active_two = 0
          // 获取二级分类数据
          let param = {
            where: {
              parent_poi_material_top_types: obj.id
            }
          }
          let result = await API.GET('classes/material_second_types', param)
          model.secondType = result.data.items
        }
        // 点击二级分类，获取三级分类数据
        if (level === 'two') {
          if (model.active_two == obj.id) { return }
          model.active_two = obj.id
          model.thirdType = []
          // 获取三级分类数据
          let param = {
            where: {
              parent_poi_material_second_types: obj.id
            }
          }
          let result = await API.GET('classes/material_third_types', param)
          model.thirdType = result.data.items
        }
      },
      //  启用/禁用
      switchState: async function (level, obj) {
            // 一级分类
        let tmp = {
          id: obj.id
        }
        // 关闭
        if (obj.switch_state === 'on') {
          tmp.switch_state = 'off'
          model.active_two = 0
          model.active_three = 0
        } else {
          // 开启
          tmp.switch_state = 'on'
        }
        
        let result = await API.PUT('classes/' + levelTabel[level], tmp)
        obj.switch_state = tmp.switch_state
        Core.alert('success', '更新成功！')
      }, 

      //  删除分类
      destroyItemo: async function (level, obj) {
        if (confirm('确定删除？')) {
          let result = await API.DELETE('classes/' + levelTabel[level], obj)
          if (level === 'one') {
            model.firstType = _.without(model.firstType, obj)
            model.secondType = []
            model.thirdType = []
          }
          if (level === 'two') {
            model.secondType = _.without(model.secondType, obj)
            model.thirdType = []
          }
          if (level === 'three') {
            model.thirdType = _.without(model.thirdType, obj)
          }
          Core.alert('success', '删除成功！')
        }
      },
      //  点击添加分类
      optItems: function (level, typ, obj) {
        objInfo = obj
        model.classifyData = {
          id: (obj || {}).id || '',
          level: level,
          hole_poi_hardware_hole_config: (obj || {}).hole_poi_hardware_hole_config || '',
          name: (obj || {}).name || '',
          type: typ,
          active_one: model.active_one,
          active_two: model.active_two,
          logic_type: (obj || {}).logic_type || '',
          switch_state: (obj || {}).switch_state || 'on',
          state: Math.random()
        }
      }
    },
    created () {
      model = this
      model.init()
    }
  }
</script>
<style lang="scss" scoped>
  .con-box{
    .box-header{
      .btn{
        a{
          color: #fff;
        }
      }
    }
    table {
      white-space: nowrap;
      thead{
        th {
          color: #333;
          font-weight: 500;
        }
      }
      tbody{
        td{
          border: 1px solid #f4f4f4;
        }
      }
    }
  }
</style>
