<template lang="pug">
  div.con-box
    div.wrap
      div.box-header.row
        div.col-md-12
          div.col-md-9
            nuxt-link.btn.btn-success(to="/workstationlist/new" role="button")
              i.fe.fe-plus.mr-2
              | 新增
          div.col-md-3
            <searchbasic flag="eventsearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
      div.body-box
        div.table-responsive
          table.table.card-table.table-striped.table-vcenter
            thead
              tr
                th(v-for="sub in tableheaders") {{sub.name}}
            tbody
              tr(v-for="(item, num) in events")
                td {{num + 1}}
                td 
                  a(href="javascript:;") {{item.event_name}}
                td {{item.event_key}}
                td {{item.actual_interface || '暂无 '}}
                td {{localDate(item.create_time)}}
                td.opers
                  nuxt-link(:to="'/arkhardware/edit?id=' + item.id" title="编辑" )
                    i.fa.fa-pencil
                  a(href="javascript:;" title="删除" @click="deleteListItem(item)")
                    i.fa.fa-trash
                  a(href="javascript:;" title="设置" @click="deleteListItem(item)")
                    i.fa.fa-cog            
        div.loading-box(v-if="loadingState")
          vueloading
        pagination(flag="eventslist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>

<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  export default {
    head () {
      return {
        title: '事件列表'
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
            key: 'id'
          },
          {
            name: '名称',
            key: ''
          },
          {
            name: '事件key',
            key: ''
          },
          {
            name: '事件对应接口',
            key: ''
          },
          {
            name: '创建时间',
            key: ''
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
        events: []  //  工位模板列表
      }
    },
    methods: {
      // 初始化数据
      // 2018.7.11 王翀
      init: async function () {
        await model.getListData()
      },

      // 删除
      deleteListItem: function (obj) {
        if(confirm('是否要删除？')) {
          API.DELETE('classes/office_unit_design_template', {id: obj.id}).then((msg) => {
            Core.alert('success', '删除成功')
            model.init()
            _.without(model.workstations, obj)
          })
        }
      },
      // 初始化基础数据
      // 2018.7.11 王翀
      // obj(object) query信息
      initbasicData: function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        model.workstations = []
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          pages: result.pages || 1,
          pagetotal: 1,
          placeholder: '事件名称',
          pagesize: Core.getPageSize()
        }
        model.loadingState = true
      },

      // 获取列表数据
      // 2018-06-30 yuguo
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
            with: ''
          }
          result = await API.GET('classes/messages_event', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'messages_event',
            like: JSON.stringify(['event_name']),
            search: $.trim(model.basicdata.searchkey),
            new_where: JSON.stringify({}),
            with: '',
            limit: model.basicdata.pagesize,
            skip: model.basicdata.pagesize * (model.basicdata.pages - 1),
            order: '-id'
          }
          result = await API.GET('functions/search/search_vague', searchpar)
        }
        model.loadingState = false
        model.events = result.data.items
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
