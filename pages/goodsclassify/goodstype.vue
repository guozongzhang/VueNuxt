<template lang="pug">
  div.con-box
    div.nav-self-box
      <crumbs-vue obj="goodstype"></crumbs-vue>
      div.info-body
        div.row(v-cloak)
          div.col-md-2
            div.stacked-box
              div.box-header 一级分类
              div.loading-box(v-if="loadingFirstState")
                vueloading
              ul.nav-stacked
                li.item(v-for="one in typeArr.one")
                  a(@click="getNextLevels(one, 'one')" v-bind:class="active.one == one.id ? 'active' : ''") {{one.ftt_name}}
                    i.fa.fa-check
          div.col-md-5
            div.stacked-box
              div.box-header 二级分类
              div.loading-box(v-if="loadingSecondState")
                vueloading
              ul.nav-stacked
                li.item(v-for="two in typeArr.two")
                  a(@click="getNextLevels(two, 'two')" v-bind:class="active.two == two.id ? 'active' : ''") {{two.sp_type_name}}
                    i.fa.fa-check
                    i.fa.fa-pencil(@click="optItems(two, 'edit', 'two')")
                    i.fa.fa-trash(@click="deleteItem('furniture_simple_types', two, typeArr.two)")
                li.plus-item(@click="optItems('', 'add', 'two')" v-if="active.one > 0")
                  a
                    i.fa.fa-plus  
          div.col-md-5
            div.stacked-box
              div.box-header 三级分类
              div.loading-box(v-if="loadingThirdState")
                vueloading
              ul.nav-stacked
                li.item(v-for="three in typeArr.three")
                  a {{three.type_name}}
                    i.fa.fa-pencil(@click="optItems(three, 'edit', 'three')")
                    i.fa.fa-trash(@click="deleteItem('furniture_types', three, typeArr.three)")
                li.plus-item(@click="optItems('', 'add', 'three')" v-if="active.two > 0")
                  a
                    i.fa.fa-plus
      <goodstype-vue :info="types" @addEditItem="getModelData"></goodstype-vue>
</template>

<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  import crumbsVue from '~/components/goodsclassify/crumbs.vue'
  import goodsTypeVue from '~/components/goodsclassify/_goodstype.vue'
  let tmpObj = {}
  export default {
    head () {
      return {
        title: '商品分类'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingFirstState: true,
        loadingSecondState: false,
        loadingThirdState: false,
        typeArr: {
          one: [], // 一级分组
          two: [], // 二级分组
          three: [] //  三级分组
        },
        active: {
          one: 0,
          two: 0
        },
        types: {
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
    components: {
      'crumbs-vue': crumbsVue,
      'goodstype-vue': goodsTypeVue
    },
    methods: {
      // 初始化数据 
      // 2018-07-06 yuguo
      init: function () {
        model.loadingFirstState = true
        model.getFirstData()
      },

      // 获取一、二、三级分类数据
       // 2018-07-06 yuguo
      getFirstData: async function () {
        // 获取一级分类
        let result = await API.GET('classes/furniture_top_type', {order: 'id'})
        model.loadingFirstState = false
        model.typeArr.one = result.data.items
      },

      // 获取下级分类数据
      // 2018-07-06 yuguo
      // obj(object)当前对象  typ(string)级别
      getNextLevels: async function (obj, level) {
        if (level == 'one') {
          model.loadingSecondState = true
          model.active.two = 0
          model.typeArr.three = []
          model.typeArr.two = []
          let two = await API.GET('classes/furniture_simple_types', {order: 'id', limit: 10000, where: {ftt_id_poi_furniture_top_type: obj.id}})
          model.loadingSecondState = false
          model.typeArr.two = two.data.items
        } else {
          model.typeArr.three = []
          let three = await API.GET('classes/furniture_types', {order: 'id', limit: 10000, where: {sp_type_id_poi_furniture_simple_types: obj.id}})
          model.typeArr.three = three.data.items
          model.loadingThirdState = false
        }
        model.active[level] = obj.id
      },

      // 新增、编辑二、三级分类
      // 2018-07-06 yuguo
      // obj(object) 当前对象 type(string)操作类型 level(string)二级或者三级分类
      optItems: function (obj, type, level) {
        model.types = {
          id: 0,
          type: type == 'add' ? 0 : obj.id,
          level: level,
          name: type == 'add' ? 0 : obj.id,
          icon_url: type == 'add' ? 0 : obj.id,
          sp_type_poi_model_simple_types: 0,
          model_types: -1,
          state: 0
        }
        tmpObj = obj
        if (level == 'two') {
          model.types = {
            id: type == 'add' ? 0 : obj.id,
            type: type,
            level: level,
            name: type == 'add' ? '' : obj.sp_type_name,
            icon_url: type == 'add' ? '' : obj.sp_icon_url,
            sp_type_poi_model_simple_types: obj.model_type_poi_model_simple_types,
            model_types: type == 'add' ? '-1' : obj.model_type_poi_model_simple_types,
            state: Math.random()
          }
        } else {
           model.types = {
            id: type == 'add' ? 0 : obj.id,
            type: type,
            level: level,
            name: type == 'add' ? '' : obj.type_name,
            icon_url: type == 'add' ? '' : obj.icon_url,
            sp_type_poi_model_simple_types: model.getModelSimple(),
            model_types: type == 'add' ? '-1' : obj.model_types_id_poi_model_types,
            state: Math.random()
          }
        }
      },

      // 获取active二级分类模型id
      getModelSimple: function () {
        let resid = 0
        model.typeArr.two.forEach((sub) => {
          if (sub.id == model.active.two) {
            resid = sub.model_type_poi_model_simple_types
          }
        })
        return resid
      },

      // 获取模态框返回数据
      // 2018-07-06 yuguo
      getModelData: async function (obj) {
        let result = {}
        if (obj.level == 'two') {
          let params = {
            sp_type_name: obj.name,
            sp_icon_url: obj.icon_url,
            model_type_poi_model_simple_types: obj.model_types,
            ftt_id_poi_furniture_top_type: model.active.one
          }
          if (obj.type == 'add') {
            result = await API.POST('classes/furniture_simple_types', params)
            model.typeArr.two.push(result.data)
          } else {
            params = _.extend(params, {id: obj.id})
            result = await API.PUT('classes/furniture_simple_types', params)
            tmpObj.sp_type_name = obj.name
            tmpObj.sp_icon_url = obj.icon_url
            tmpObj.model_type_poi_model_simple_types = obj.model_types
          }
        } else {
          let params = {
            type_name: obj.name,
            icon_url: obj.icon_url,
            ftt_id_poi_furniture_top_type: model.active.one,
            model_types_id_poi_model_types: obj.model_types,
            sp_type_id_poi_furniture_simple_types: model.active.two
          }
          if (obj.type == 'add') {
            result = await API.POST('classes/furniture_types', params)
            model.typeArr.three.push(result.data)
          } else {
            params = _.extend(params, {id: obj.id})
            result = await API.PUT('classes/furniture_types', params)
            tmpObj.type_name = obj.name
            tmpObj.icon_url = obj.icon_url
            tmpObj.model_types_id_poi_model_types = obj.model_types
          }
        }
        Core.alert('success', obj.type == 'add' ? '添加' : '编辑' + '成功')
        $('#goodstype').modal('hide')
      },

      // 删除列表单条数据(仅支持万能接口删除)
      // 2018-07-06 yuguo
      // table(string)数据表名称, item(object)需要删除的数据对象, ObjArr(arrray)当前列表的数据数组
      deleteItem: function (table, item, ObjArr) {
        if (!confirm('确定删除该记录')) {
          return false
        }
        API.DELETE('classes/' + table, {id: item.id}).then(function (response) {
          Core.alert('success', '删除成功')
          if (model.active.two == item.id) {
            model.active.two = 0
            model.typeArr.three = []
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
