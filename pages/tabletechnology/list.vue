<template lang="pug">
  div.con-box
    div.wrap
      div.box-header.row
        div.col-md-12
          div.col-md-9
            nuxt-link.btn.btn-success(to="/tabletechnology/new" role="button")
              i.fe.fe-plus.mr-2
              | 新增
          div.col-md-3
            <searchbasic flag="tabletechnologysearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
      div.body-box
        div.table-responsive
          table.table.card-table.table-striped.table-vcenter
            thead
              tr
                th(v-for="sub in tableheaders") {{sub.name}}
            tbody
              tr(v-for="(item, num) in dataArr")
                td {{num + 1}}
                td
                  a.fancybox(rel="group" :href="item.image_url")
                    img(:src="resizeIMG(item.image_url, 20, 20)" style="width:20px;height:20px")
                td {{item.name}}
                td {{item.remark || '暂无'}}
                td 
                  span.switch-plug(:data-content="item.state == 'on' ? '启用' : '禁用'" :data-switch="item.state" @click="switchStateBtn('table_board_style', item, 'state')")
                td.opers
                  nuxt-link(:to="'/tabletechnology/edit?id=' + item.id" title="编辑")
                    i.fa.fa-pencil
                  a(href="javascript:;" title="删除" @click="deleteListItem('table_board_style', item, dataArr)")
                    i.fa.fa-trash
        div.loading-box(v-if="loadingState")
          vueloading
        pagination(flag="countlist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>

<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '板件样式列表'
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
            name: '预览图',
            key: ''
          },
          {
            name: '板件名称',
            key: ''
          },
          {
            name: '描述',
            key: ''
          },
          {
            name: '状态',
            key: ''
          },
          {
            name: '操作',
            key: ''
          }
        ],
        basicdata: {
          searchkey: '',
          placeholder: '板件名称',
          pagetotal: 1,
          pagesize: 15,
          pages: 1
        },
        dataArr: []
      }
    },
    methods: {
      // 初始化数据
      // 2018-06-29 yuguo
      init: async function () {
        await model.getListData()
      },

      // 初始化基础数据
      // 2018-06-29 yuguo
      // obj(object) query信息
      initbasicData: function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        model.dataArr = []
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          pages: result.pages || 1,
          pagetotal: 1,
          placeholder: '板件名称',
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
      },

      // 获取列表数据
      // 2018-06-29 yuguo
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
            with: JSON.stringify({})
          }
          result = await API.GET('classes/table_board_style', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'table_board_style',
            like: JSON.stringify(['name', 'remark']),
            search: $.trim(model.basicdata.searchkey),
            new_where: JSON.stringify({}),
            with: JSON.stringify({}),
            limit: model.basicdata.pagesize,
            skip: model.basicdata.pagesize * (model.basicdata.pages - 1),
            order: '-id'
          }
          result = await API.GET('functions/search/search_vague', searchpar)
        }
        model.loadingState = false
        model.dataArr = result.data.items
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
