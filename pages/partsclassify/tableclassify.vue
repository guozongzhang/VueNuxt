<template lang="pug">
  div.con-box
    div.nav-self-box
      <crumbs-vue obj="tableclassify"></crumbs-vue>
      div.info-body
        div.row(v-cloak)
          div.col-md-5
            div.stacked-box
              div.box-header 二级分类
              div.loading-box(v-if="loadingFirstState")
                vueloading
              ul.nav-stacked
                li.item(v-for="two in secondType")
                  a(@click="getNextLevels(two, 'two')" v-bind:class="active_two == two.id ? 'active' : ''") {{two.name}}
                    i.fa.fa-check
                    i.fa.fa-pencil(@click="optItems(two, 'edit', 'two')")
                    i.fa.fa-trash(@click="deleteItem('table_part_simple_types', two, secondType)")
                li.plus-item(@click="optItems('', 'add', 'two')")
                  a
                    i.fa.fa-plus  
          div.col-md-5
            div.stacked-box
              div.box-header 三级分类
              div.loading-box(v-if="loadingSecondState")
                vueloading
              ul.nav-stacked
                li.item(v-for="three in thirdType")
                  a {{three.name}}
                    i.fa.fa-pencil(@click="optItems(three, 'edit', 'three')")
                    i.fa.fa-trash(@click="deleteItem('table_part_types', three, thirdType)")
                li.plus-item(@click="optItems('', 'add', 'three')" v-if="active_two > 0")
                  a
                    i.fa.fa-plus
        <twotype-vue :info="twotypes" @addEditTwoItem="getTwoModelData"></twotype-vue>
        <threetype-vue :info="threetypes" @addEditThreeItem="getThreeModelData"></threetype-vue>
</template>

<script>
  let model
  let tmpTwo = {}
  let tmpThree = {}
  let _ = require('underscore')
  import API from '~/plugins/axios'
  import crumbsVue from '~/components/partsclassify/crumbs.vue'
  import twoModelVue from '~/components/partsclassify/_tabletwo.vue'
  import threeModelVue from '~/components/partsclassify/_tablethree.vue'
  export default {
    head () {
      return {
        title: '桌台零部件分类'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingFirstState: true,
        loadingSecondState: false,
        secondType: [],  //  二级分组
        thirdType: [],  //  三级分组
        active_two: 0,
        active_three: 0,
        twotypes: {
          id: 0,
          type: '',
          name: '',
          icon_url: '',
          model_type_poi_model_simple_types: -1,
          logic_type: -1,
          show_in_design: 1,
          remark: '',
          state: 0
        },
        threetypes: {
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
    components: {
      'crumbs-vue': crumbsVue,
      'twotype-vue': twoModelVue,
      'threetype-vue': threeModelVue
    },
    methods: {
      // 初始化数据 
      // 2018-06-27 yuguo
      init: function () {
        model.loadingFirstState = true
        model.getFirstData()
      },

      // 获取二级分类数据
      // 2018-06-27 yuguo
      getFirstData: async function () {
        let result = await API.GET('classes/table_part_simple_types', {order: '-id', parent: 0})
        model.loadingFirstState = false
        model.secondType = result.data.items
      },

      // 获取三级分类数据
      // 2018-06-27 yuguo
      // obj(object)
      getNextLevels: async function (obj, typ) {
        if (model.active_two == obj.id) return
        if (typ == 'two') {
          model.loadingSecondState = true
          model.thirdType = []
           model.active_two = obj.id
          let params = {
            order: '-id',
            limit: 50,
            where: {sp_type_poi_table_part_simple_types: obj.id}
          }
          let result = await API.GET('classes/table_part_types', params)
          model.loadingSecondState = false
          model.thirdType = result.data.items
        } else {
          model.active_three = obj.id
        }
      },

       // 新增、编辑二级分类
      // 2018-06-29 yuguo
      // obj(object) 当前对象 type(string)操作类型 level(string)二级或者三级分类
      optItems: function (obj, type, level) {
        // 二级分类
        if (level == 'two') {
          if (type == 'add') {
            model.twotypes = {
              id: 0,
              type: type,
              name: '',
              icon_url: '',
              model_type_poi_model_simple_types: -1,
              logic_type: -1,
              show_in_design: 1,
              remark: '',
              state: Math.random()
            }
          } else {
            tmpTwo = obj
            model.twotypes = {
              id: obj.id,
              type: type,
              name: obj.name,
              icon_url: obj.icon_url,
              model_type_poi_model_simple_types: obj.model_type_poi_model_simple_types,
              logic_type: obj.logic_type,
              show_in_design: obj.show_in_design,
              remark: obj.remark,
              state: Math.random()
            }
          }
        } else {
          // 三级分类
          if (type == 'add') {
            model.threetypes = {
              id: 0,
              type: type,
              name: '',
              model_types_id_poi_model_types: -1,
              logic_type: -1,
              show_in_design: 1,
              remark: '',
              state: Math.random()
            }
          } else {
            tmpThree = obj
            model.threetypes = {
              id: obj.id,
              type: type,
              name: obj.name,
              model_types_id_poi_model_types: obj.model_types_id_poi_model_types,
              logic_type: obj.logic_type,
              show_in_design: obj.show_in_design,
              remark: obj.remark || '',
              state: Math.random()
            }
          }
        }
      },

      // 接受模态框提交的数据(二级分类)
      // 2018-06-29 yuguo
      // obj(object) 模态框数据对象
      getTwoModelData: async function (obj) {
        let params = {
          name: obj.name,
          icon_url: obj.icon_url,
          model_type_poi_model_simple_types: obj.model_type_poi_model_simple_types,
          logic_type: obj.logic_type,
          show_in_design: obj.show_in_design,
          remark: obj.remark || ''
        }
        let result = {}
        if (obj.type == 'add') {
          // 新增
          result = await API.POST('classes/table_part_simple_types', params)
          model.secondType.unshift(result.data)
        } else {
          // 编辑
          params = _.extend(params, {id: obj.id})
          result = await API.PUT('classes/table_part_simple_types', params)
          tmpTwo.name = obj.name
          tmpTwo.remark = obj.remark
          tmpTwo.icon_url = obj.icon_url
          tmpTwo.logic_type = obj.logic_type
          tmpTwo.show_in_design = obj.show_in_design
          tmpTwo.model_type_poi_model_simple_types = obj.model_type_poi_model_simple_types
        }
        Core.alert('success', (obj.type == 'add' ? '添加' : '编辑') + '成功')
        $('#tabletwo').modal('hide')
      },

      // 接受模态框提交的数据(三级分类)
      // 2018-06-29 yuguo
      // obj(object) 模态框数据对象
      getThreeModelData: async function (obj) {
        let params = {
          name: obj.name,
          model_types_id_poi_model_types: obj.model_types_id_poi_model_types,
          logic_type: obj.logic_type,
          show_in_design: obj.show_in_design,
          remark: obj.remark || '',
          sp_type_poi_table_part_simple_types: model.active_two
        }
        let result = {}
        if (obj.type == 'add') {
          // 新增
          result = await API.POST('classes/table_part_types', params)
          model.thirdType.unshift(result.data)
        } else {
          // 编辑
          params = _.extend(params, {id: obj.id})
          result = await API.PUT('classes/table_part_types', params)
          tmpThree.name = obj.name
          tmpThree.show_in_design = obj.show_in_design
          tmpThree.logic_type = obj.logic_type
          tmpThree.model_types_id_poi_model_types = obj.model_types_id_poi_model_types
          tmpThree.remark = obj.remark
        }
        Core.alert('success', obj.type == 'add' ? '添加' : '编辑' + '成功')
        $('#tablethree').modal('hide')
      },

      // 删除列表单条数据(仅支持万能接口删除)
      // 2018-06-27 yuguo
      // table(string)数据表名称, item(object)需要删除的数据对象, ObjArr(arrray)当前列表的数据数组
      deleteItem: function (table, item, ObjArr) {
        if (!confirm('确定删除该记录')) {
          return false
        }
        API.DELETE('classes/' + table, {id: item.id}).then(function (response) {
          Core.alert('success', '删除成功')
          if (model.active_two == item.id) {
            model.active_two = 0
            model.init()
            model.thirdType = []
          }
          ObjArr.splice($.inArray(item, ObjArr, 0), 1)
        })
        .catch(function () {
          Core.alert('danger', '删除失败')
        })
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
    padding: 0;
    .info-body{
      padding: 20px 10px;
      .nav-stacked{
        .item {
          a.active {
            border-left-color: #3c8dbc;
            color: red;
            .fa{
              color: #333;
            }
            .fa-check{
              color: red;
              display: inline-block;
            }
          }
        }
      }
      .box-header{
        font-weight: 600;
      }
    }
  }
</style>
