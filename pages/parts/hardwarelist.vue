<template lang="pug">
 div.con-box
  div.nav-self-box
    <crumbs-vue obj="hardwarelist"></crumbs-vue>
    div.info-body
      div.card
        div.box-header.row
          div.col-md-12
            div.col-md-9
              <searchform flag="highsearch" :obj="searchobj" @callback="getsearchdata"></searchform>
            div.col-md-3
              <searchbasic flag="hardwarepartsearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
        div.body-box
          div.table-responsive
            table.table.card-table.table-striped.table-vcenter
              thead
                tr
                  th(v-for="sub in tableheaders") {{sub.name}}
              tbody
                tr(v-for="(item, num) in partlist")
                  td {{num + 1}}
                  td 
                    a.fancybox(rel="group" :href="item.preview_url")
                      img(:src="resizeIMG(item.preview_url, 20, 20)" style="width:20px;height:20px")
                  td {{item.name}}
                  td {{item.version}}
                  td {{(item.second_poi_hardware_second_parts_type || {}).name}}{{(item.second_poi_hardware_second_parts_type || {}).name ? ' - ' + (item.third_poi_hardware_third_parts_type || {}).name : ''}}
                  td {{(item.top_poi_hardware_parts_group || {}).name}}{{(item.second_poi_hardware_parts_group || {}).name ? ' / ' + (item.second_poi_hardware_parts_group || {}).name : ''}}{{(item.third_poi_hardware_parts_group || {}).name ? ' / ' + (item.third_poi_hardware_parts_group || {}).name : ''}}
                  td {{(item.com_id_poi_companys || {}).com_name}}
                  td {{refcd(item.state, 'hardware_part_state')}}
                  td {{localDate(item.update_time)}}
                  td.opers
                    a(href="javascript:;" title="查看原因" )
                      i.fe.fe-eye
                  td
                    span.switch-plug(:data-content="item.state == 'up' ? '启用' : '禁用'" :data-switch="item.state == 'up' ? 'on' : 'off'" v-show="item.state == 'up' || item.state == 'dstop'")
          div.loading-box(v-if="loadingState")
            vueloading
          pagination(flag="partlist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>
<script>
  let model
  let newwhere = {}
  let _ = require('underscore')
  import API from '~/plugins/axios'
  import crumbsVue from '~/components/parts/crumbs.vue'
  let rel = {
    include: [
      {
        table: 'second_poi_hardware_second_parts_type',
        keys: 'name'
      },
      {
        table: 'com_id_poi_companys',
        keys: 'id,com_name'
      },
      {
        table: 'third_poi_hardware_third_parts_type',
        keys: 'name'
      },
      {
        table: 'top_poi_hardware_parts_group',
        keys: 'name'
      },
      {
        table: 'second_poi_hardware_parts_group',
        keys: 'name'
      },
      {
        table: 'third_poi_hardware_parts_group',
        keys: 'name'
      }
    ]
  }
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
        basicdata: {
          searchkey: '',
          placeholder: '',
          pagetotal: 1,
          pagesize: 15,
          pages: 1
        },
        searchobj: [
          {
            text: '一级分类',
            typ: 'select',
            table: 'hardware_second_parts_type',
            options: [],
            key: 'second_poi_hardware_second_parts_type',
            isinit: true,
            whereobj: {},
            linkinfo: [
              {
                subkey: 'third_poi_hardware_third_parts_type',  //  关联表查询字段
                wherekey: 'second_poi_hardware_second_parts_type'
              }
            ],
            optionMap: {
              keyId: 'id',  //  返回数据中需要使用的字段（选择id）
              keyVal: 'name'  //  返回数据中需要使用的字段（展示在UI上）
            }
          },
          {
            text: '二级分类',
            typ: 'select',
            table: 'hardware_third_parts_type',
            options: [],
            key: 'third_poi_hardware_third_parts_type',
            isinit: false,
            whereobj: {},
            linkinfo: [
            ],
            optionMap: {
              keyId: 'id',
              keyVal: 'name'
            }
          }
        ],
        tableheaders: [
          {
            name: '序号',
            key: 'id',
            order: '-'
          },
          {
            name: '预览图',
            key: ''
          },
          {
            name: '部件名称',
            key: ''
          },
          {
            name: '部件型号',
            key: ''
          },
          {
            name: '分类',
            key: ''
          },
          {
            name: '分组',
            key: ''
          },
          {
            name: '所属公司',
            key: ''
          },
          {
            name: '状态',
            key: ''
          },
          {
            name: '更新时间',
            key: ''
          },
          {
            name: '操作',
            key: ''
          },
          {
            name: '启用/禁用',
            key: ''
          }
        ],
        partlist: [],
        pagetotal: 1,
        pagesize: store.get(location.pathname + '_pagsize') || 15
      }
    },
    components: {
      'crumbs-vue': crumbsVue
    },
    methods: {
      // 初始化数据
      // 2018-06-22 yuguo
      init: async function () {
        await model.getListData()
      },

      // 初始化基础数据
      // 2018-06-22
      // obj(object) query信息
      initbasicData: function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        for(let k in obj) {
          if (k != 'pages' && k != 'searchkey') {
            newwhere[k] = obj[k]
          }
        }
        model.partlist = []
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          placeholder: '部件名称/型号',
          pages: result.pages || 1,
          pagetotal: 1,
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
      },
      // 点击搜索组件按钮
      // 2018.7.9 王翀
      getsearchdata: function (obj) {
        //  将搜索结果传给URL
        this.$router.push({path: this.$route.path, query: obj})
      },

      // 获取列表数据
      // 2018-06-22 yuguo
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
            where: JSON.stringify(newwhere),
            // where: JSON.stringify({sp_type_poi_supplier_part_sp_type: {'$ne': 3000}}),
            with: JSON.stringify(rel)
          }
          result = await API.GET('classes/hardware_parts', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'hardware_parts',
            like: JSON.stringify(['name', 'version']),
            search: $.trim(model.basicdata.searchkey),
            new_where: JSON.stringify({sp_type_poi_supplier_part_sp_type: {'$ne': 3000}}),
            with: JSON.stringify(rel),
            limit: model.basicdata.pagesize,
            skip: model.basicdata.pagesize * (model.basicdata.pages - 1),
            order: '-id'
          }
          result = await API.GET('functions/search/search_vague', searchpar)
        }
        model.loadingState = false
        model.partlist = result.data.items
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
