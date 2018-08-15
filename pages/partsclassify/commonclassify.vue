<template lang="pug">
  div.con-box
    div.nav-self-box
      <crumbs-vue obj="commonclassify"></crumbs-vue>
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
                    i.fa.fa-trash(@click="deleteItem('supplier_part_sp_type', two, secondType)")
                    
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
                  a(@click="getNextLevels(three, 'three')" v-bind:class="active_three == three.id ? 'active' : ''") {{three.name}}
                    i.fa.fa-pencil(@click="optItems(three, 'edit', 'three')")
                    i.fa.fa-trash(@click="deleteItem('supplier_part_type', three, thirdType)")
                li.plus-item(@click="optItems('', 'add', 'three')" v-if="active_two > 0")
                  a
                    i.fa.fa-plus  
        <twotype-vue :info="twotypes" @addEditTwoItem="getTwoModelData"></twotype-vue>
        <threetype-vue :info="threetypes" @addEditThreeItem="getThreeModelData"></threetype-vue>
</template>

<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  import crumbsVue from '~/components/partsclassify/crumbs.vue'
  import twoModelVue from '~/components/partsclassify/_commontwo.vue'
  import threeModelVue from '~/components/partsclassify/_commonthree.vue'
  let tmpTwo = {}
  export default {
    head () {
      return {
        title: '普通零部件分类'
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
          remark: '',
          sp_icon_url: '',
          state: 0
        },
        threetypes: {
          id: 0,
          type: '',
          name: '',
          remark: '',
          material_category: '',
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
      // 2018.6.22 yuguo
      init: function () {
        model.loadingFirstState = true
        model.getFirstData()
      },

      // 获取二级分类数据
      // 2018-06-22 yuguo
      getFirstData: async function () {
        let result = await API.GET('classes/supplier_part_sp_type', {order: '-id'})
        model.loadingFirstState = false
        model.secondType = result.data.items
      },

      // 获取三级分类数据
      // 2018-06-22 yuguo
      // obj(object)
      getNextLevels: async function (obj, typ) {
        if (model.active_two == obj.id) return
        if (typ == 'two') {
          model.loadingSecondState = true
          model.thirdType = []
          model.active_two = obj.id
          let params = {
            order: '-id',
            where: {sp_type_poi_supplier_part_sp_type: obj.id}
          }
          let result = await API.GET('classes/supplier_part_type', params)
          model.loadingSecondState = false
          model.thirdType = result.data.items
        } else {
          model.active_three = obj.id
        }
      },

      // 新增、编辑二级分类
      // 2018-06-27 yuguo
      // obj(object) 当前对象 type(string)操作类型 level(string)二级或者三级分类
      optItems: function (obj, type, level) {
        if (level == 'two') {
          if (type == 'add') {
            model.twotypes = {
              id: 0,
              type: type,
              name: '',
              remark: '',
              sp_icon_url: '',
              state: Math.random()
            }
          } else {
            tmpTwo = obj
            model.twotypes = {
              id:  obj.id,
              type: type,
              name: obj.name,
              remark: obj.remark,
              sp_icon_url: obj.sp_icon_url,
              state: Math.random()
            }
          }
        } else {
          if (type == 'add') {
            model.threetypes = {
              id: 0,
              type: type,
              name: '',
              remark: '',
              material_category: '',
              state: Math.random()
            }
          } else {
            tmpTwo = obj
            model.threetypes = {
              id:  obj.id,
              type: type,
              name: obj.name,
              remark: obj.remark,
              material_category: obj.material_category,
              state: Math.random()
            }
          }
        }
      },

      // 获取模态框提交数据(二级分类)
      // 2018-06-27 yuguo
      // obj(object) 模态框数据对象
      getTwoModelData: async function (obj) {
        let params = {
          name: obj.name,
          sp_icon_url: obj.sp_icon_url,
          remark: obj.remark || ''
        }
        let result = {}
        if (obj.type == 'add') {
          // 新增
          result = await API.POST('classes/supplier_part_sp_type', params)
          model.secondType.unshift(result.data)
        } else {
          // 编辑
          params = _.extend(params, {id: obj.id})
          result = await API.PUT('classes/supplier_part_sp_type', params)
          tmpTwo.name = obj.name
          tmpTwo.remark = obj.remark
          tmpTwo.sp_icon_url = obj.sp_icon_url
        }
        Core.alert('success', obj.type == 'add' ? '添加' : '编辑' + '成功')
        $('#commontwo').modal('hide')
      },

       // 获取模态框提交数据(三级分类)
      // 2018-06-27 yuguo
      // obj(object) 模态框数据对象
      getThreeModelData: async function (obj) {
        let params = {
          sp_type_poi_supplier_part_sp_type: model.active_two,
          name: obj.name,
          material_category: obj.material_category,
          remark: obj.remark || ''
        }
        let result = {}
        if (obj.type == 'add') {
          // 新增
          result = await API.POST('classes/supplier_part_type', params)
          model.thirdType.unshift(result.data)
        } else {
          // 编辑
          params = _.extend(params, {id: obj.id})
          result = await API.PUT('classes/supplier_part_type', params)
          tmpTwo.name = obj.name
          tmpTwo.remark = obj.remark
          tmpTwo.material_category = obj.material_category
        }
        Core.alert('success', obj.type == 'add' ? '添加' : '编辑' + '成功')
        $('#commonthree').modal('hide')
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
