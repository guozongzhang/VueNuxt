<template lang="pug">
  div.con-box
    div.wrap
      div.box-header.row
        div.col-md-12
          div.col-md-9
            nuxt-link.btn.btn-success(to="/arkhardware/new" role="button")
              i.fe.fe-plus.mr-2
              | 新增
          div.col-md-3
            <searchbasic flag="arkhardwaresearch" :obj="basicdata" @getsearchdate="getListData"></searchbasic>
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
                  a.fancybox(rel="group" :href="item.preview_url")
                    img(:src="resizeIMG(item.preview_url, 20, 20)" style="width:20px;height:20px")
                td {{item.name}}
                td {{(item.config_rel_hardware_hole_config_detail || {}).count}}
                td {{item.remark || '暂无'}}
                td.opers
                  nuxt-link(:to="'/arkhardware/edit?id=' + item.id" title="编辑" )
                    i.fa.fa-pencil
                  a(href="javascript:;" title="删除" @click="deleteListItem('hardware_hole_config', item, dataArr)")
                    i.fa.fa-trash
        div.loading-box(v-if="loadingState")
          vueloading
        pagination(flag="hardwarelist" v-bind:total="basicdata.pagetotal" v-bind:size="basicdata.pagesize" v-on:callback="getListData")
</template>

<script>
  let model
  let _ = require('underscore')
  import API from '~/plugins/axios'
  let rel = {
    relation: [
      {
        table: 'hardware_hole_config_detail',
        key: 'config_poi_hardware_hole_config'
      }
    ]
  }
  export default {
    head () {
      return {
        title: '五金孔位列表'
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
            name: '预览图',
            key: ''
          },
          {
            name: '方案名称',
            key: ''
          },
          {
            name: '孔位个数',
            key: ''
          },
          {
            name: '备注',
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
        dataArr: []
      }
    },
    methods: {
      // 初始化数据
      // 2018-06-30 yuguo
      init: async function () {
        await model.getListData()
      },

      // 初始化基础数据
      // 2018-06-30 yuguo
      // obj(object) query信息
      initbasicData: function (obj) {
        let result = !_.isEmpty(obj) ? obj : (this.$route.query || {})
        model.dataArr = []
        model.basicdata = {
          searchkey: result.searchkey ?  result.searchkey : '',
          pages: result.pages || 1,
          pagetotal: 1,
          placeholder: '五金孔位方案名称',
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
            with: JSON.stringify(rel)
          }
          result = await API.GET('classes/hardware_hole_config', condition)
        } else {
          // 搜索
          let searchpar = {
            table: 'hardware_hole_config',
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
