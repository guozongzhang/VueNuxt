<template lang="pug">
  div.con-box
    div.wrap
      div.box-header.row
          div.col.md-9
          div.col-md-3
            <searchbasic flag="countlistsearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
      div.body-box
        div.table-responsive
          table.table.card-table.table-striped.table-vcenter
            thead
              tr
                th(v-for="sub in tableheaders") {{sub.name}}
            tbody
              tr(v-for="(item, num) in priceArr")
                td {{num + 1}}
                td {{item.name}}
                td
                  a.fancybox(rel="group" :href="item.preview_url")
                    img(:src="resizeIMG(item.preview_url, 20, 20)" style="width:20px;height:20px")
                td {{item.version}}
                td(v-show="item.type == 'hardware'") {{item.diameter}}*{{item.length}}
                td(v-show="item.type != 'hardware'") {{item.length}}*{{item.width}}*{{item.height}}
                td(v-if="!item.count_poi_unit_count")  常量表amount_unit过滤
                td(v-if="item.count_poi_unit_count")  {{(item.count_poi_unit_count || {}).name || '暂无'}}
                td(v-if="!item.price_poi_unit_price")  常量表amount_unit
                td(v-if="item.price_poi_unit_price")  {{(item.price_poi_unit_price || {}).name || '暂无'}}
                td {{(item.top_poi_material_top_types || {}).name || '暂无'}}-{{(item.second_poi_material_second_types || {}).name || '暂无'}}-{{(item.third_poi_material_third_types || {}).name || '暂无'}}
                td {{(item.top_poi_material_group || {}).name || '暂无'}}{{(item.second_poi_material_group || {}).name || '暂无'}}{{(item.third_poi_material_group || {}).name || '暂无'}}
                td {{(item.com_id_poi_companys || {}).com_name || '暂无'}}
                td 
                  span(style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap; width: 100px;display:inline-block") {{item.remark}}
                td {{refcd(item.switch_state, 'orimaterial_state')}}
                td 
                  span.switch-plug(v-bind:data-content="item.switch_state == 'dpj_off' ? '启用' : '禁用'" v-bind:data-switch="item.switch_state" @click="switchState(item)")
        div.loading-box(v-if="loadingState")
          vueloading
        pagination(flag="pricelist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>

<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  let rel = {
  include: [
    {
      table: 'top_poi_material_top_types'
    },
    {
      table: 'second_poi_material_second_types'
    },
    {
      table: 'third_poi_material_third_types'
    },
    {
      table: 'top_poi_material_group'
    },
    {
      table: 'second_poi_material_group'
    },
    {
      table: 'third_poi_material_group'
    },
    {
      table: 'com_id_poi_companys',
      keys: 'id,com_name'
    },
    {
      table: 'count_poi_unit_count',
      keys: 'name'
    },
    {
      table: 'price_poi_unit_price',
      keys: 'name'
    }
  ]
}
  export default {
    head () {
      return {
        title: '原料列表'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingState: true,
        priceArr: [],
        tableheaders: [
          {
            name: '序号',
            order: '-'
          },
          {
            name: '名称',
            key: 'name'
          },
          {
            name: '预览图'
          },
          {
            name: '型号'
          },
          {
            name: '尺寸'
          },
          {
            name: '计数单位'
          },
          {
            name: '计价单位'
          },
          {
            name: '所属分类'
          },
          {
            name: '所属分组'
          },
          {
            name: '所属公司'
          },
          {
            name: '备注'
          },
          {
            name: '状态'
          },
          {
            name: '操作'
          }
        ],
        basicdata: {
          searchkey: '',
          placeholder: '原料名称',
          pagetotal: 1,
          pagesize: 15,
          pages: 1
        },
        materialArr: []
      }
    },
    methods: {
      // 初始化数据 2018.6.12 王翀
      init: async function () {
        await model.getListData()
      },

      // 初始化基础数据 2018.6.12 王翀
      initbasicData: function (obj) {
        model.countArr = []
        model.basicdata = {
          searchkey: obj ? (!_.isEmpty(obj.searchkey) ?  obj.searchkey : '') : '',
          pages: (obj || {}).pages || model.$route.query.pages || 1,
          pagetotal: 1,
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
        model.product = []
      },

      //  启用/禁用  2018.6.13 王翀
      switchState: function (item) {
        let param = {
          id: item.id
        }
        if (item.switch_state == 'off') {
          Core.alert('error', '厂家已禁用，不能操作！')
          return
        }
        let api = item.switch_state == 'on' ? 'functions/material/material_platform_disable' : 'functions/material/material_enable'
        API.POST(api, param).then((msg) => {
          item.switch_state = item.switch_state == 'on' ? 'dpj_off' : 'on'
          Core.alert('success', '操作成功')
        })
      },
      // 获取列表数据 2018.6.8 王翀
      // obj(object) query信息
      getListData: async  function (obj) {
        model.initbasicData(obj)
        let result = {}
        if (_.isEmpty(model.basicdata.searchkey)) {
          // 正常请求
          let condition = {
            skip: (model.basicdata.pages - 1) * model.basicdata.pagesize,
            limit: model.basicdata.pagesize,
            order: '-id',
            with: JSON.stringify(rel)
          }
          result = await API.GET('classes/material', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'unit_price',
            like: JSON.stringify(['name']),
            search: $.trim(model.basicdata.searchkey),
            new_where: JSON.stringify({}),
            with: JSON.stringify(rel),
            limit: model.basicdata.pagesize,
            skip: model.basicdata.pagesize * (model.basicdata.pages - 1),
            order: '-id'
          }
          result = await API.GET('functions/search/search_vague', searchpar)
        }
        model.loadingState = false
        model.priceArr = result.data.items
        model.basicdata.pagetotal = result.data.count
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
