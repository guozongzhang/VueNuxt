<template lang="pug">
  div.con-box
    div.wrap
      div.box-header.row
        div.col-md-12
          div.col-md-9
            nuxt-link.btn.btn-success(to="/unitmanage/newprice"  role="button")
              i.fe.fe-plus.mr-2
              | 新增
          div.col-md-3
            <searchbasic flag="pricelistsearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
      div.body-box
        div.table-responsive
          table.table.card-table.table-striped.table-vcenter
            thead
              tr
                th(v-for="sub in tableheaders") {{sub.name}}
            tbody
              tr(v-for="(item, num) in priceArr")
                td {{num + 1}}
                td 
                  nuxt-link(:to="'/unitmanage/indexprice?id=' + item.id") {{item.name}}
                td {{item.remark || '暂无'}}
                td {{(item.uid_poi_admin || {}).username}}
                td {{localDate(item.update_time)}}
                td 
                  span.switch-plug(:data-content="item.switch_state == 'on' ? '启用' : '禁用'" :data-switch="item.switch_state" @click="switchStateBtn('unit_price', item, 'switch_state')")
                td.opers
                  nuxt-link(:to="'/unitmanage/editprice?id=' + item.id" title="编辑" )
                    i.fa.fa-pencil
                  a(href="javascript:;" title="删除" @click="deleteListItem('unit_price', item, priceArr)")
                    i.fa.fa-trash
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
        table: 'uid_poi_admin',
        keys: 'id,username'
      }
    ]
  }
  export default {
    head () {
      return {
        title: '计数单位列表'
      }
    },
    layout: 'layout',
    components: {
    },
    data () {
      return {
        loadingState: true,
        tableheaders: [
          {
            name: '序号',
            key: 'id',
            order: '-'
          },
          {
            name: '名称',
            key: 'name'
          },
          {
            name: '备注',
            key: 'remark'
          },
          {
            name: '创建人',
            key: ''
          },
          {
            name: '更新时间',
            key: 'update_time'
          },
          {
            name: '状态',
            key: 'switch_state'
          },
          {
            name: '操作',
            key: ''
          }
        ],
        basicdata: {
          searchkey: '',
          placeholder: '',
          pagetotal: 1,
          pagesize: 15,
          pages: 1
        },
        priceArr: []
      }
    },
    methods: {
      // 初始化数据
      // 2018-06-02 yuguo
      init: async function () {
        await model.getListData()
      },

      // 初始化基础数据
      // 2018-06-06
      // obj(object) query信息
      initbasicData: function (obj) {
        model.countArr = []
        model.basicdata = {
          searchkey: obj ? (!_.isEmpty(obj.searchkey) ?  obj.searchkey : '') : '',
          pages: (obj || {}).pages || model.$route.query.pages || 1,
          placeholder: '单位名称',
          pagetotal: 1,
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
        model.product = []
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
          result = await API.GET('classes/unit_price', condition)
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
