<template lang="pug">
 div.con-box
  div.nav-self-box
    div.nav-tabs-custom
      ul.nav.nav-tabs
        li
          a(href="/production/list") 企业产品库
        li.active
          a(href="/production/publiclist") 公共产品库
    div.info-body
      div.box-header
        div.form-group.col-md-9
          div.col-md-3
            label.col-md-4.control-label 一级分类：
            div.col-md-8
              select.form-control.search-val(v-model="wardrobe.type_poi_product_top_types" v-on:change="choiceFirstType()")
                option(value="-1") 请选择分类
                option(v-for="item in firstTypes" v-bind:value="item.id") {{item.name}}    
          div.col-md-3
            label.col-md-4.control-label 二级分类：
            div.col-md-8
              select.form-control.search-val(v-model="wardrobe.type_poi_product_second_types" v-on:change="choiceSecondType()")
                option(value="-1") 请选择
                option(v-for="item in secondTypes" v-bind:value="item.id") {{item.name}}    
          div.col-md-3
            label.col-md-4.control-label 三级分类：
            div.col-md-8
              select.form-control.search-val(v-model="wardrobe.type_poi_product_third_types")
                option(value="-1") 请选择
                option(v-for="item in thirdTypes" v-bind:value="item.id") {{item.name}}  
        div.col-md-3
          <searchbasic flag="countlistsearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>        
        div.body-box
          div.table-responsive
            table.table.card-table.table-striped.table-vcenter
              thead
                tr
                  th(v-for="sub in tableheaders") {{sub.name}}
              tbody
                tr(v-for="(item, num) in productions")
                  td {{num + 1}}
                  td 
                    img(:src="resizeIMG(item.image_url, 20, 20)" style="width:20px;height:20px")
                  td {{item.name}}
                  td {{item.code}}
                  td {{(item.type_poi_product_top_types || {}).name || ''}}-{{(item.type_poi_product_second_types || {}).name || ''}}-{{(item.type_poi_product_third_types || {}).name || ''}}
                  td {{(item.top_poi_products_group || {}).name || ''}}/{{(item.second_poi_products_group || {}).name || ''}}/{{(item.third_poi_products_group || {}).name || ''}}
                  td {{refcd(item.state, 'plane_state')}}
                  td
                    span.switch-plug(v-if="item.switch_state == 'passed'" :data-content="item.switch_state == 'passed' ? '启用' : '禁用'" :data-switch="item.switch_state == 'passed' ? 'on' : 'off'")
          div.loading-box(v-if="loadingState")
            vueloading
          pagination(flag="productionlist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>
<script>
  let model
  let rel = {
  include: [
    {
      table: 'type_poi_product_top_types',
      keys: 'id,name'
    },
    {
      table: 'type_poi_product_second_types',
      keys: 'id,name'
    },
    {
      table: 'type_poi_product_third_types',
      keys: 'id,name'
    },
    {
      table: 'top_poi_products_group',
      keys: 'id,name'
    },
    {
      table: 'second_poi_products_group',
      keys: 'id,name'
    },
    {
      table: 'third_poi_products_group',
      keys: 'id,name'
    }
  ]
}
  import API from '~/plugins/axios'
  let _ = require('underscore')
  export default {
    head () {
      return {
        title: '产品库列表'
      }
    },
    layout: 'layout',
    data () {
      return {
        loadingState: true,
        wardrobe: {
          type_poi_product_top_types: -1, // 一级分类
          type_poi_product_second_types: -1, // 二级分类
          type_poi_product_third_types: -1 // 三级分类
        },
        basicdata: {
          searchkey: '',
          placeholder: '单位名称',
          pagetotal: 1,
          pagesize: 15,
          pages: 1
        },  //  搜索绑定对象
        firstTypes: [],  //  一级分类
        secondTypes: [],  //  二级分类
        thirdTypes: [],  //  三级分类
        tableheaders: [
          {
            name: '序号',
            key: 'id',
            order: '-'
          },
          {
            name: '产品预览图',
            key: 'image_url'
          },
          {
            name: '产品名称',
            key: 'name'
          },
          {
            name: '型号',
            key: 'code'
          },
          {
            name: '一级分类',
            key: 'type_poi_product_top_types',
            options: this.tablesOption(TopType.limit(1000), {value: 'id', text: 'name'}, '')
          },
          {
            name: '二级分类',
            key: 'type_poi_product_second_types',
            options: this.tablesOption(SecondType.limit(1000), {value: 'id', text: 'name'}, ''),
            relation: {parent_poi_product_top_types: 'type_poi_product_top_types'}
          },
          {
            name: '三级分类',
            key: 'type_poi_product_third_types',
            options: this.tablesOption(ThirdType.limit(1000), {value: 'id', text: 'name'}, ''),
            relation: {parent_poi_product_second_types: 'type_poi_product_second_types'}
          },
          {
            name: '产品状态',
            key: 'state'
          }
        ],
        productions: [],
        pagetotal: 1,
        pagesize: store.get(location.pathname + '_pagsize') || 15
      }
    },
    methods: {
      // 初始化数据
      // 2018-7-4 王翀
      init: function () {
        let pages = this.$route.query.page || 1
        model.getListData(1)
        model.getFirstType()
      },

      // 选择一级分类
      choiceFirstType: function () {
        model.wardrobe.second_poi_material_second_types = -1
        model.wardrobe.third_poi_material_third_types = -1
        let whereObj = {
          where: {
            parent_poi_material_top_types: model.wardrobe.type_poi_product_top_types,
            switch_state: 'on'
          }
        }
        API.GET('classes/product_second_types', whereObj).then((msg) => {
          model.secondTypes = msg.data.items
          model.thirdTypes = []
        })
      },
      // 选择二级分类
      choiceSecondType: function () {
        model.wardrobe.type_poi_product_third_types = -1
        model.thirdTypes = []
        let whereObj = {
          where: {
            parent_poi_material_second_types: model.wardrobe.type_poi_product_second_types,
            switch_state: 'on'
          }
        }
        API.GET('classes/product_third_types', whereObj).then((msg) => {
          model.thirdTypes = msg.data.items
        })
      },
      // 获取列表数据
      // 2018-7-4 王翀
      initbasicData: async function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          pages: result.pages || 1,
          pagetotal: 1,
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
        model.productions = []
      },
      
      //  获取列表数据
      getListData: async function (obj) {
        model.initbasicData(obj)
        let result = {}
        if (_.isEmpty(model.basicdata.searchkey)) {
          let param = Core.checkKey(model.wardrobe)
          param.type = 2
          param.com_id_poi_companys = {'$gt': 0}
          let tmp = {
            where: JSON.stringify(param)
          }

          let condition = {
            skip: (model.basicdata.pages - 1) * model.basicdata.pagesize,
            limit: model.basicdata.pagesize,
            order: '-id',
            with: JSON.stringify(rel),
            where: JSON.stringify({type: 2, com_id_poi_companys: {'$gt': 0}})
          }
          console.log('---', tmp)
          result = await API.GET('classes/products', condition, tmp)
        } else {
          //  搜索
          let searchpar = {
            table: 'products',
            like: JSON.stringify(['name']),
            search: $.trim(model.basicdata.searchkey),
            new_where: JSON.stringify(Core.checkKey(model.wardrobe)),
            with: JSON.stringify(rel),
            limit: model.basicdata.pagesize,
            skip: model.basicdata.pagesize * (model.basicdata.pages - 1),
            order: '-id'
          }
          result = await API.GET('functions/search/search_vague', searchpar)
        }
        model.loadingState = false
        model.productions = result.data.items
        model.basicdata.pagetotal = result.data.count
      },
      //  获取一级分类
      getFirstType: async function () {
        let where = {
          switch_state: 'on'
        }
        API.GET('classes/product_top_types', where).then((msg) => {
          model.firstTypes = msg.data.items
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
      padding: 10px;
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
  }
</style>
