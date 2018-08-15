<template lang="pug">
 div.con-box
  div.nav-self-box
    <crumbs-vue obj="commonlist"></crumbs-vue>
    div.info-body
      div.card
        div.box-header.row
          div.col-md-12
            div.col-md-9
              <searchform flag="highsearch" :obj="searchobj" @callback="getsearchdata"></searchform>
            div.col-md-3
              <searchbasic flag="commonpartsearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
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
                  td {{item.code}}
                  td {{(item.sp_type_poi_supplier_part_sp_type || {}).name}}{{(item.sp_type_poi_supplier_part_sp_type || {}).name ? ' - ' + (item.type_poi_supplier_part_type || {}).name : ''}}
                  td {{(item.top_poi_supplier_parts_group || {}).name}}{{(item.second_poi_supplier_parts_group || {}).name ? ' / ' + (item.second_poi_supplier_parts_group || {}).name : ''}}{{(item.third_poi_supplier_parts_group || {}).name ? ' / ' + (item.third_poi_supplier_parts_group || {}).name : ''}}
                  td {{(item.com_id_poi_companys || {}).com_name}}
                  td {{refcd(item.part_state, 'subpart_state')}}
                  td {{localDate(item.update_time)}}
                  td.opers
                    a(href="javascript:;" title="查看原因" )
                      i.fe.fe-eye
                  td
                    span.switch-plug(:data-content="item.part_state == 'up' ? '启用' : '禁用'" :data-switch="item.part_state == 'up' ? 'on' : 'off'" v-show="item.part_state == 'up' || item.part_state == 'dstop'")
          div.loading-box(v-if="loadingState")
            vueloading
          div.nodata(v-if="!loadingState && partlist.length == 0")
            p 暂无数据...
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
        table: 'sp_type_poi_supplier_part_sp_type',
        keys: 'name'
      },
      {
        table: 'com_id_poi_companys',
        keys: 'id,com_name'
      },
      {
        table: 'type_poi_supplier_part_type',
        keys: 'name'
      },
      {
        table: 'top_poi_supplier_parts_group',
        keys: 'name'
      },
      {
        table: 'second_poi_supplier_parts_group',
        keys: 'name'
      },
      {
        table: 'third_poi_supplier_parts_group',
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
        searchobj: [
          {
            text: '一级分类',
            typ: 'select',
            table: 'supplier_part_sp_type',
            options: [],
            key: 'sp_type_poi_supplier_part_sp_type',
            isinit: true,
            whereobj: {},
            linkinfo: [
              {
                subkey: 'type_poi_supplier_part_type',
                wherekey: 'sp_type_poi_supplier_part_sp_type',
                map: {
                  keyId: 'id',
                  keyVal: 'name'
                }
              }
            ],
            optionMap: {
              keyId: 'id',
              keyVal: 'name'
            }
          },
          {
            text: '二级分类',
            typ: 'select',
            table: 'supplier_part_type',
            options: [],
            key: 'type_poi_supplier_part_type',
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

      // 获取搜索数据
      // 2018-07-09 yuguo
      getsearchdata: function (obj) {
        //  将搜索结果传给URL
        this.$router.push({path: this.$route.path, query: obj})
      },

      // 初始化基础数据
      // 2018-06-22
      // obj(object) query信息
      initbasicData: function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        newwhere = {sp_type_poi_supplier_part_sp_type: {'$ne': 3000}}
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
          whereobj: '',
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
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
            with: JSON.stringify(rel)
          }
          result = await API.GET('classes/supplier_parts', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'supplier_parts',
            like: JSON.stringify(['name', 'code']),
            search: $.trim(model.basicdata.searchkey),
            new_where: JSON.stringify(newwhere),
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
